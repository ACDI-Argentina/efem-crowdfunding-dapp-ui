import { createSelector } from 'reselect'
import BigNumber from 'bignumber.js';
import { selectDonationsByIds } from '../reducers/donationsSlice';
import { selectExchangeRates } from '../reducers/exchangeRatesSlice';
import Web3Utils from 'lib/blockchain/Web3Utils';

const donationTokenBalanceReducer = (totalBalance, donation) => {
  return BigNumber.sum(totalBalance, donation.amountRemainding);
};

const fiatBalanceReducer = (totalBalance, tokenBalance) => {
  return BigNumber.sum(totalBalance, tokenBalance.fiatBalance);
};

const makeSelectDonationsBalance = () => {
  return createSelector(
    [selectDonationsByIds, selectExchangeRates],
    (donations, exchangeRates) => {
      let tokenBalances = exchangeRates.map(er => {
        let tokenAddress = er.tokenAddress;
        let tokenBalance = new BigNumber(donations.filter(d => Web3Utils.addressEquals(d.tokenAddress, tokenAddress)).reduce(donationTokenBalanceReducer, 0));
        let fiatBalance = tokenBalance.div(er.rate);
        return {
          tokenAddress: tokenAddress,
          tokenBalance: tokenBalance,
          fiatBalance: fiatBalance
        }
      });
      return {
        tokenBalances: tokenBalances,
        fiatTotalBalance: new BigNumber(tokenBalances.reduce(fiatBalanceReducer, 0))
      }
    }
  )
}

export default makeSelectDonationsBalance;