import { store } from '../store';
import { selectExchangeRateByToken, updateExchangeRate } from '../reducers/exchangeRatesSlice';

/**
 * Clase utilitaria para el manejo de exchange rates a través de Redux.
 */
class ExchangeRateUtils {

  constructor() { }
  /**
   * @param data datos del exchange rate. should be an instance of ExchangeRate
   */
  updateExchangeRate(exchangeRate) {
    const action = updateExchangeRate(exchangeRate)
    store.dispatch(action);
  }

  getExchangeRateByTokenAddress(tokenAddress) {
    return selectExchangeRateByToken(store.getState(), tokenAddress);
  }
}

export default new ExchangeRateUtils();