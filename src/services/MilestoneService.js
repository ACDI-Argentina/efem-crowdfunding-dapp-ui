import BigNumber from 'bignumber.js';
import { utils } from 'web3';
import { paramsForServer } from 'feathers-hooks-common';
import Milestone from 'models/Milestone';
import { feathersClient } from 'lib/feathersClient';
import extraGas from 'lib/blockchain/extraGas';
import Donation from '../models/Donation';

const milestones = feathersClient.service('milestones');

BigNumber.config({ DECIMAL_PLACES: 18 });

class MilestoneService {
  constructor() {
    this.milestoneSubscription = null;
  }

  /**
   * Get a Milestone defined by ID
   *
   * @param id   ID of the Milestone to be retrieved
   */
  static get(id) {
    return new Promise((resolve, reject) => {
      milestones
        .find({ query: { _id: id } })
        .then(resp => {
          resolve(new Milestone(resp.data[0]));
        })
        .catch(reject);
    });
  }

  /**
   * Subscribe to a Milestone defined by ID
   *
   * @param id   ID of the Milestone to be retrieved
   */
  static subscribeOne(id, onResult, onError) {
    this.milestoneSubscription = milestones
      .watch({ listStrategy: 'always' })
      .find({ query: { _id: id } })
      .subscribe(resp => {
        onResult(new Milestone(resp.data[0]));
      }, onError);
    return this.milestoneSubscription;
  }

  /**
   * Lazy-load Milestones by subscribing to Milestone listener
   *
   * @param milestoneStatus   any of the Milestone model statuses
   * @param ownerAddress      ethereum address of the owner
   * @param recipientAddress  ethereum address of the recipient
   * @param skipPages         paging: the current page
   * @param itemsPerPage      paging: amount of items per page
   *
   * returns a Promise
   *  resolve:
   *    Object
   *      data                (Array) Milestone models
   *      limit               (Number) items per page
   *      skipped             (Number) pages skipped
   *      totalResults        (Number) total results
   *
   *  reject:
   *    error message
   */
  static async subscribeMyMilestones({
    milestoneStatus,
    ownerAddress,
    recipientAddress,
    skipPages,
    itemsPerPage,
    onResult,
    onError,
  }) {
    const query = {
      $sort: {
        createdAt: -1,
      },
      $limit: itemsPerPage,
      $skip: skipPages * itemsPerPage,
    };

    if ([Milestone.CANCELED, Milestone.PAID].includes(milestoneStatus)) {
      query.$and = [
        {
          $or: [
            { ownerAddress },
            // { reviewerAddress: myAddress }, // Not really "My Milestones"
            { recipientAddress },
          ],
        },
        { status: milestoneStatus },
      ];
    } else if (milestoneStatus === Milestone.REJECTED) {
      query.$and = [
        {
          $or: [
            { ownerAddress },
            // { reviewerAddress: myAddress }, // Not really "My Milestones"
            { recipientAddress },
          ],
        },
        { status: Milestone.REJECTED },
      ];
    } else {
      const resp = await feathersClient.service('campaigns').find({
        query: {
          ownerAddress,
          $select: ['_id'],
        },
      });

      query.$and = [
        {
          $or: [
            { ownerAddress },
            { reviewerAddress: ownerAddress },
            { recipientAddress: ownerAddress },
            {
              $and: [
                { campaignId: { $in: resp.data.map(c => c._id) } },
                { status: Milestone.PROPOSED },
              ],
            },
          ],
        },
        { status: { $nin: [Milestone.PAID, Milestone.CANCELED, Milestone.REJECTED] } },
      ];
    }

    this.subscribe(query, onResult, onError);
  }

  /**
   * Lazy-load Milestones by subscribing to Milestone listener
   *
   * @param query     A feathers query
   *
   * returns a Promise
   *  resolve:
   *    Object
   *      data                (Array) Milestone models
   *      limit               (Number) items per page
   *      skipped             (Number) pages skipped
   *      totalResults        (Number) total results
   *
   *  reject:
   *    error message
   */

  static subscribe(query, onResult, onError) {
    this.milestoneSubscription = milestones
      .watch({ listStrategy: 'always' })
      .find({ query })
      .subscribe(
        resp => {
          try {
            onResult(
              Object.assign({}, resp, {
                data: resp.data.map(m => new Milestone(m)),
              }),
            );
          } catch (e) {
            onError(e);
          }
        },

        onError,
      );
  }

  /**
   * Unsubscribe from Milestone listener
   */

  static unsubscribe() {
    if (this.milestoneSubscription) this.milestoneSubscription.unsubscribe();
  }

  /**
   * Get Active Milestones sorted by created date
   *
   * @param $limit    Amount of records to be loaded
   * @param $skip     Amounds of records to be skipped
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static getActiveMilestones($limit = 100, $skip = 0, onSuccess = () => {}, onError = () => {}) {
    return feathersClient
      .service('milestones')
      .find({
        query: {
          status: Milestone.IN_PROGRESS,
          $sort: { createdAt: -1 },
          $limit,
          $skip,
        },
      })
      .then(resp => onSuccess(resp.data.map(m => new Milestone(m)), resp.total))
      .catch(onError);
  }

  /**
   * Get Milestone donations
   *
   * @param id        ID of the Milestone which donations should be retrieved
   * @param $limit    Amount of records to be loaded
   * @param $skip     Amounds of records to be skipped
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static getDonations(id, $limit = 100, $skip = 0, onSuccess = () => {}, onError = () => {}) {
    return feathersClient
      .service('donations')
      .find(
        paramsForServer({
          query: {
            amountRemaining: { $ne: 0 },
            status: { $ne: Donation.FAILED },
            $or: [{ intendedProjectTypeId: id }, { ownerTypeId: id }],
            $sort: { usdValue: -1, createdAt: -1 },
            $limit,
            $skip,
          },
          schema: 'includeTypeAndGiverDetails',
        }),
      )
      .then(resp => onSuccess(resp.data.map(d => new Donation(d)), resp.total))
      .catch(onError);
  }

  /**
   * Subscribe to count of new donations. Initial resp will always be 0. Any new donations
   * that come in while subscribed, the onSuccess will be called with the # of newDonations
   * since initial subscribe
   *
   * @param id        ID of the Campaign which donations should be retrieved
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static subscribeNewDonations(id, onSuccess, onError) {
    let initalTotal;
    return feathersClient
      .service('donations')
      .watch()
      .find(
        paramsForServer({
          query: {
            amountRemaining: { $ne: 0 },
            status: { $ne: Donation.FAILED },
            $or: [{ intendedProjectTypeId: id }, { ownerTypeId: id }],
            $sort: { createdAt: -1 },
            $limit: 0,
          },
          schema: 'includeTypeAndGiverDetails',
        }),
      )
      .subscribe(resp => {
        if (initalTotal === undefined) {
          initalTotal = resp.total;
          onSuccess(0);
        } else {
          onSuccess(resp.total - initalTotal);
        }
      }, onError);
  }

  /**
   * Delete a proposed milestone
   *
   * @param milestone   a Milestone model
   * @param onSuccess   Callback function once response is obtained successfully
   * @param onError     Callback function if error is encountered
   */
  static deleteProposedMilestone({ milestone, onSuccess, onError }) {
    milestones
      .remove(milestone._id)
      .then(() => onSuccess())
      .catch(e => onError(e));
  }

  /**
   * Reject a proposed milestone
   *
   * @param milestone       a Milestone model
   * @param rejectReason    (string, optional) message why the milestone is rejected
   * @param onSuccess       Callback function once response is obtained successfully
   * @param onError         Callback function if error is encountered
   */
  static rejectProposedMilestone({ milestone, rejectReason, onSuccess, onError }) {
    const reject = { status: 'Rejected' };
    if (rejectReason) reject.message = rejectReason;
    milestones
      .patch(milestone._id, reject)
      .then(() => onSuccess())
      .catch(e => onError(e));
  }

  /**
   * Repropose a proposed milestone that has been rejected
   *
   * @param milestone       a Milestone model
   * @param message         (string, optional) Reason why the milestone was reproposed
   * @param onSuccess       Callback function once response is obtained successfully
   * @param onError         Callback function if error is encountered
   */
  static reproposeRejectedMilestone({ milestone, message, onSuccess, onError }) {
    milestones
      .patch(milestone._id, {
        status: Milestone.PROPOSED,
        message,
      })
      .then(() => onSuccess())
      .catch(e => onError(e));
  }

  /**
   * Request a milestone to be marked as complete
   *
   * @param milestone       a Milestone model
   * @param from            (string) Ethereum address
   * @param proof           A proof object:
        message               Reason why the milestone is marked as complete
        items                 Attached proof
   * @param onConfirmation  Callback function once the transaction was mined
   * @param onError         Callback function if error is encountered
   */
  static async requestMarkComplete({ milestone, proof, onConfirmation, onError }) {
    try {
      await milestones.patch(milestone._id, {
        status: Milestone.NEEDS_REVIEW,
        message: proof.message,
        mined: false,
      });
      onConfirmation(milestone);
    } catch (err) {
      onError(err);
    }
  }

  /**
   * Approve the completion of a milestone (after the milestone has been requested as complete)
   *
   * @param milestone       a Milestone model
   * @param proof           A proof object:
        message               Reason why the milestone is approved for completion
        items                 Attached proof
   * @param onConfirmation  Callback function once the transaction was mined
   * @param onError         Callback function if error is encountered
   */

  static approveMilestoneCompletion({ milestone, proof, onConfirmation, onError }) {
    milestone.status = Milestone.COMPLETED;
    return milestones
      .patch(milestone._id, {
        status: Milestone.COMPLETED,
        mined: false,
        message: proof.message,
        proofItems: proof.items,
      })
      .then(() => onConfirmation(milestone))
      .catch(onError);
  }

  /**
   * Reject the completion of a milestone (after the milestone has been requested as complete)
   *
   * @param milestone       a Milestone model
   * @param from            (string) Ethereum address
   * @param proof           A proof object:
        message               Reason why the milestone is rejected for completion
        items                 Attached proof
   * @param onTxHash        Callback function once the transaction was created
   * @param onConfirmation  Callback function once the transaction was mined
   * @param onError         Callback function if error is encountered
   */

  static rejectMilestoneCompletion({ milestone, proof, onConfirmation, onError }) {
    milestone.status = Milestone.IN_PROGRESS;
    return milestones
      .patch(milestone._id, {
        status: Milestone.IN_PROGRESS,
        mined: false,
        message: proof.message,
        proofItems: proof.items,
      })
      .then(() => onConfirmation(milestone))
      .catch(onError);
  }

  /**
   * Withdraw the donations (pledges) from a milestone
   * Only possible when the milestones was approved for completion
   *
   * @param milestone       a Milestone model
   * @param from            (string) Ethereum address
   * @param onTxHash        Callback function once the transaction was created
   * @param onConfirmation  Callback function once the transaction was mined
   * @param onError         Callback function if error is encountered
   */

  static withdraw({ milestone, onConfirmation, onError }) {
    milestone.status = Milestone.PAID;
    return milestones
      .patch(milestone._id, {
        status: Milestone.PAID,
      })
      .then(() => onConfirmation(milestone))
      .catch(onError);
  }
}

export default MilestoneService;
