import { createSlice } from '@reduxjs/toolkit'
import Web3Utils from 'lib/blockchain/Web3Utils';
import ExchangeRate from '../../models/ExchangeRate'

export const exchangeRatesSlice = createSlice({
  name: 'exchangeRates',
  initialState: [],
  reducers: {
    fetchExchangeRates: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    updateExchangeRate: (state, action) => {
      const exchangeRateStore = action.payload.toStore();
      const idx = state.findIndex(exr => Web3Utils.addressEquals(exr.tokenAddress, exchangeRateStore.tokenAddress));
      if(idx > -1){
        state[idx] = exchangeRateStore;
      } else {
        state.push(exchangeRateStore);
      }
    },
    resetExchangeRates: (state, action) => {
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let exchangeRateStore = action.payload[i].toStore();
        state.push(exchangeRateStore);
      }
    },
    handleError: (state, action) => {
      //TODO: ADD LOGIC FOR HANDLE ERROR
    },
  },
});

export const { fetchExchangeRates, updateExchangeRate } = exchangeRatesSlice.actions;

export const selectExchangeRates = (state) => {
  return state.exchangeRates.map(function (exchangeRateStore) {
    return new ExchangeRate(exchangeRateStore);
  });
};

export const selectExchangeRateByToken = (state, tokenAddress) => {
  let exchangeRate = state.exchangeRates.find(er => Web3Utils.addressEquals(er.tokenAddress, tokenAddress));
  if (exchangeRate) {
    return new ExchangeRate(exchangeRate);
  }
  return undefined;
};

export default exchangeRatesSlice.reducer;