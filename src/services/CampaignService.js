/* import { paramsForServer } from 'feathers-hooks-common';
import Milestone from 'models/Milestone';
import { feathersClient } from '../lib/feathersClient';
import Campaign from '../models/Campaign';
import Donation from '../models/Donation';

 */
class CampaignService {

  /**
   * Get a Campaign defined by ID
   *
   * @param id   ID of the Campaign to be retrieved
   */
  static get(id) {
    return new Promise((resolve, reject) => reject("Feathers service campaigns deprecated"))
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
    return onError(new Error("Feathers service milestones deprecated"));
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
    return onError(new Error("Feathers service donations deprecated"));
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
    return onError(new Error("Feathers service donations deprecated"));
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
    return onError(new Error("Feathers service campaigns deprecated"));
  }
}

export default CampaignService;
