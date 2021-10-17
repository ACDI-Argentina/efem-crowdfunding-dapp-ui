import BigNumber from 'bignumber.js';
import Milestone from 'models/Milestone';
/* import { utils } from 'web3';
import { paramsForServer } from 'feathers-hooks-common';
import { feathersClient } from 'lib/feathersClient';
import extraGas from 'lib/blockchain/extraGas';
import Donation from '../models/Donation';
 */


BigNumber.config({ DECIMAL_PLACES: 18 });

class MilestoneService {
  constructor() {
    this.milestoneSubscription = null;
  }

  /**
   * @deprecated
   * Get a Milestone defined by ID
   *
   * @param id   ID of the Milestone to be retrieved
   */
  static get(id) {
    return new Promise((resolve, reject) => reject("Feathers service milestones deprecated"))
  }

  /**
   * @deprecated
   * Subscribe to a Milestone defined by ID
   *
   * @param id   ID of the Milestone to be retrieved
   */
  static subscribeOne(id, onResult, onError) {
    return onError(new Error("Feathers service milestones deprecated"));
  }

  /**
   * @deprecated
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
      throw new Error("Feathers service campaings deprecated")
    }

    this.subscribe(query, onResult, onError);
  }

  /**
   * @deprecated
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
    return onError(new Error("Feathers service milestones deprecated"));
  }

  /**
   * Unsubscribe from Milestone listener
   */

  static unsubscribe() {
    if (this.milestoneSubscription) this.milestoneSubscription.unsubscribe();
  }

  /**
   * @deprecated
   * Get Active Milestones sorted by created date
   *
   * @param $limit    Amount of records to be loaded
   * @param $skip     Amounds of records to be skipped
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static getActiveMilestones($limit = 100, $skip = 0, onSuccess = () => { }, onError = () => { }) {
    return onError(new Error("Feathers service milestones deprecated"));
  }

  /**
   * @deprecated
   * Get Milestone donations
   *
   * @param id        ID of the Milestone which donations should be retrieved
   * @param $limit    Amount of records to be loaded
   * @param $skip     Amounds of records to be skipped
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static getDonations(id, $limit = 100, $skip = 0, onSuccess = () => { }, onError = () => { }) {
    return onError(new Error("Feathers service milestones deprecated"));
  }

  /**
   * @deprecated
   * Subscribe to count of new donations. Initial resp will always be 0. Any new donations
   * that come in while subscribed, the onSuccess will be called with the # of newDonations
   * since initial subscribe
   *
   * @param id        ID of the Campaign which donations should be retrieved
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static subscribeNewDonations(id, onSuccess, onError) {
    return onError(new Error("Feathers service donations deprecated"));
  }

  /**
   * @deprecated
   * Delete a proposed milestone
   *
   * @param milestone   a Milestone model
   * @param onSuccess   Callback function once response is obtained successfully
   * @param onError     Callback function if error is encountered
   */
  static deleteProposedMilestone({ milestone, onSuccess, onError }) {
    return onError(new Error("Feathers service milestones deprecated"));
  }

  /**
   * @deprecated
   * Reject a proposed milestone
   *
   * @param milestone       a Milestone model
   * @param rejectReason    (string, optional) message why the milestone is rejected
   * @param onSuccess       Callback function once response is obtained successfully
   * @param onError         Callback function if error is encountered
   */
  static rejectProposedMilestone({ milestone, rejectReason, onSuccess, onError }) {
    return onError(new Error("Feathers service milestones deprecated"));
  }

  /**
   * @deprecated
   * Repropose a proposed milestone that has been rejected
   *
   * @param milestone       a Milestone model
   * @param message         (string, optional) Reason why the milestone was reproposed
   * @param onSuccess       Callback function once response is obtained successfully
   * @param onError         Callback function if error is encountered
   */
  static reproposeRejectedMilestone({ milestone, message, onSuccess, onError }) {
    return onError(new Error("Feathers service milestones deprecated"));
  }

  /**
   * @deprecated
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
    return onError(new Error("Feathers service milestones deprecated"));
  }

  /**
   * @deprecated
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
    return onError(new Error("Feathers service milestones deprecated"));
  }

  /**
   * @deprecated
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
    return onError(new Error("Feathers service milestones deprecated"));
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
    return onError(new Error("Feathers service milestones deprecated"));
  }
}

export default MilestoneService;
