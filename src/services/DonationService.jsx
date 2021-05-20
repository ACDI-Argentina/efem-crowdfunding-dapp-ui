import { utils } from 'web3';
import BigNumber from 'bignumber.js';
import Donation from '../models/Donation';
import DAC from '../models/DAC';
import Milestone from '../models/Milestone';
import Campaign from '../models/Campaign';
import extraGas from '../lib/blockchain/extraGas';
import { feathersClient } from '../lib/feathersClient';

import ErrorPopup from '../components/ErrorPopup';

function updateExistingDonation(donation, amount, status) {
  const mutation = {
    pendingAmountRemaining: utils.toWei(
      new BigNumber(donation.amountRemaining).minus(new BigNumber(utils.fromWei(amount))).toFixed(),
    ),
  };
  if (status) {
    mutation.status = status;
  }

  return feathersClient
    .service('donations')
    .patch(donation.id, mutation)
    .catch(err => {
      ErrorPopup('Unable to update the donation in feathers', err);
    });
}

class DonationService {

  /**
   * create a new donation instance in feathers
   *
   * @param {User} giver the giver of this donation
   * @param {object} toAdmin entity receiving the donation
   * @param {string} amount donation amount in wei
   * @param {string} txHash transactionHash of the donation tx
   */
  static newFeathersDonation(giver, toAdmin, amount, token, txHash) {
    const newDonation = {
      giverAddress: giver.address,
      amount,
      amountRemaining: amount,
      pledgeId: 0,
      status: Donation.PENDING,
      txHash,
      mined: false,
      token,
    };

    // donation to a delegate
    if (toAdmin.type === DAC.type) {
      Object.assign(newDonation, {
        ownerType: 'giver',
        ownerTypeId: giver.address,
        ownerId: giver.giverId || 0,
        delegateId: toAdmin.adminId,
        delegateType: toAdmin.type,
        delegateTypeId: toAdmin.id,
      });
    } else if (toAdmin.type === Campaign.type) {
      Object.assign(newDonation, {
        ownerType: toAdmin.type,
        ownerTypeId: toAdmin.id,
        ownerId: toAdmin.adminId,
        campaignId: toAdmin.id,
      });
    } else if (toAdmin.type === Milestone.type) {
      Object.assign(newDonation, {
        ownerType: toAdmin.type,
        ownerTypeId: toAdmin.id,
        ownerId: toAdmin.adminId,
        campaignId: toAdmin.campaignId,
      });
    } else
      Object.assign(newDonation, {
        ownerType: toAdmin.type,
        ownerTypeId: toAdmin.id,
        ownerId: toAdmin.adminId,
      });
    return feathersClient
      .service('donations')
      .create(newDonation)
      .catch(err => {
        ErrorPopup(
          'Your donation has been initiated, however an error occurred when attempting to save. You should see your donation appear within ~30 mins.',
          err,
        );
      });
  }

  static updateSpentDonations(donations) {
    return feathersClient
      .service('donations')
      .patch(
        null,
        { pendingAmountRemaining: 0 },
        { query: { _id: { $in: donations.map(d => d._id) } } },
      );
  }

  static getMilestoneDonationsCount(milestoneId) {
    return feathersClient
      .service('/donations')
      .find({
        query: {
          ownerType: 'milestone',
          ownerTypeId: milestoneId,
          amountRemaining: { $ne: 0 },
          pendingAmountRemaining: { $ne: 0 },
          status: Donation.COMMITTED,
          $limit: 0,
        },
      })
      .then(({ total }) => total);
  }

  static getMilestoneDonations(milestoneId) {
    return feathersClient
      .service('/donations')
      .find({
        query: {
          ownerType: 'milestone',
          ownerTypeId: milestoneId,
          amountRemaining: { $ne: 0 },
          pendingAmountRemaining: { $ne: 0 },
          status: Donation.COMMITTED,
          $limit: 8, // current gas costs restict us to 8 pledges
        },
      })
      .then(resp => {
        const { data } = resp;
        if (data.length === 0) throw new Error('no-donations');

        const pledges = [];
        data.forEach(donation => {
          const pledge = pledges.find(n => n.id === donation.pledgeId);

          if (pledge) {
            pledge.amount = pledge.amount.plus(donation.amountRemaining);
          } else {
            pledges.push({
              id: donation.pledgeId,
              amount: new BigNumber(donation.amountRemaining),
            });
          }
        });

        return {
          donations: data,
          hasMoreDonations: resp.data.length !== resp.total,
          pledges: pledges.map(
            pledge =>
              // due to some issue in web3, utils.toHex(pledge.amount) breaks during minification.
              // BN.toString(16) will return a hex string as well
              `0x${utils.padLeft(pledge.amount.toString(16), 48)}${utils.padLeft(
                utils.toHex(pledge.id).substring(2),
                16,
              )}`,
          ),
        };
      })
      .catch(err => err);
  }
}

export default DonationService;
