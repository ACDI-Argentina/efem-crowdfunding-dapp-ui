import { paramsForServer } from 'feathers-hooks-common';
import Milestone from 'models/Milestone';
import { feathersClient } from '../lib/feathersClient';
import Campaign from '../models/Campaign';
import Donation from '../models/Donation';

const campaigns = feathersClient.service('campaigns');

class CampaignService {

  /**
   * Get a Campaign defined by ID
   *
   * @param id   ID of the Campaign to be retrieved
   */
  static get(id) {
    return new Promise((resolve, reject) => {
      campaigns
        .find({ query: { _id: id } })
        .then(resp => {
          resolve(new Campaign(resp.data[0]));
        })
        .catch(reject);
    });
  }

  /**
   * Get Campaign milestones listener
   *
   * @param id        ID of the Campaign which donations should be retrieved
   * @param $limit    Amount of records to be loaded
   * @param $skip     Amounds of record to be skipped
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static getMilestones(id, $limit = 100, $skip = 0, onSuccess = () => {}, onError = () => {}) {
    return feathersClient
      .service('milestones')
      .find({
        query: {
          campaignId: id,
          status: {
            $nin: [Milestone.CANCELED, Milestone.PROPOSED, Milestone.REJECTED, Milestone.PENDING],
          },
          $sort: { createdAt: 1 },
          $limit,
          $skip,
        },
      })
      .then(resp => onSuccess(resp.data.map(m => new Milestone(m)), resp.total))
      .catch(onError);
  }

  /**
   * Get Campaign donations
   *
   * @param id        ID of the Campaign which donations should be retrieved
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
            status: { $ne: Donation.FAILED },
            $or: [{ intendedProjectTypeId: id }, { ownerTypeId: id }],
            ownerTypeId: id,
            isReturn: false,
            $sort: { createdAt: -1 },
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
            status: { $ne: Donation.FAILED },
            $or: [{ intendedProjectTypeId: id }, { ownerTypeId: id }],
            ownerTypeId: id,
            isReturn: false,
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
   * Get the user's Campaigns
   *
   * @param userAddress Address of the user whose Campaign list should be retrieved
   * @param skipPages     Amount of pages to skip
   * @param itemsPerPage  Items to retreive
   * @param onSuccess   Callback function once response is obtained successfully
   * @param onError     Callback function if error is encountered
   */
  static getUserCampaigns(userAddress, skipPages, itemsPerPage, onSuccess, onError) {
    return campaigns
      .watch({ listStrategy: 'always' })
      .find({
        query: {
          $or: [{ ownerAddress: userAddress }, { reviewerAddress: userAddress }],
          $sort: {
            createdAt: -1,
          },
          $limit: itemsPerPage,
          $skip: skipPages * itemsPerPage,
        },
      })
      .subscribe(resp => {
        const newResp = Object.assign({}, resp, {
          data: resp.data.map(c => new Campaign(c)),
        });
        onSuccess(newResp);
      }, onError);
  }
}

export default CampaignService;
