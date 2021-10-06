import BigNumber from 'bignumber.js'

/* import { paramsForServer } from 'feathers-hooks-common'
import { feathersClient } from '../lib/feathersClient'
import DAC from '../models/DAC'
import Campaign from '../models/Campaign'
import Donation from '../models/Donation' */
import crowdfundingContractApi from '../lib/blockchain/CrowdfundingContractApi'

BigNumber.config({ DECIMAL_PLACES: 18 });



class DACService {
  /**
   * Get a DAC defined by ID
   *
   * @param id   ID of the DAC to be retrieved
   */
  static get(id) {
    return crowdfundingContractApi.getDAC(id);
  }

  /**
   * @deprecated
   * Get DACs
   *
   * @param $limit    Amount of records to be loaded
   * @param $skip     Amounds of record to be skipped
   * @param onSuccess Callback function once response is obtained successfylly
   * @param onError   Callback function if error is encountered
   */
  
  static getDACs($limit = 100, $skip = 0, onSuccess = () => {}, onError = () => {}) {
    return onError(new Error("Feathers service dacs deprecated"));
  }

  /**
   * @deprecated
   * Lazy-load DAC Campaigns by subscribing to campaigns listener
   *
   * @param delegateId Dekegate ID of the DAC which campaigns should be retrieved
   * @param onSuccess  Callback function once response is obtained successfylly
   * @param onError    Callback function if error is encountered
   */
  static subscribeCampaigns(delegateId, onSuccess, onError) {
    return onError(new Error("Feathers service donations deprecated"));
  }

  /**
   * @deprecated
   * Get DAC donations
   *
   * @param id        ID of the DAC which donations should be retrieved
   * @param $limit    Amount of records to be loaded
   * @param $skip     Amounds of records to be skipped
   * @param onSuccess Callback function once response is obtained successfully
   * @param onError   Callback function if error is encountered
   */
  static getDonations(id, $limit = 100, $skip = 0, onSuccess = () => {}, onError = () => {}) {
    return onError(new Error("Feathers service donations deprecated"));
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
   * @description Get the user's DACs
   *
   * @param userAddress   Address of the user whose DAC list should be retrieved
   * @param skipPages     Amount of pages to skip
   * @param itemsPerPage  Items to retreive
   * @param onSuccess     Callback function once response is obtained successfully
   * @param onError       Callback function if error is encountered
   */
  static getUserDACs(userAddress, skipPages, itemsPerPage, onSuccess, onError) {
    return onError(new Error("Feathers service dacs deprecated"));
  }

}

export default DACService;
