import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators'
import crowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

export const fetchExchangeRatesEpic = action$ => action$.pipe(
  ofType('exchangeRates/fetchExchangeRates'),
  mergeMap(action => crowdfundingContractApi.getExchangeRates()),
  map(exchangeRates => ({
    type: 'exchangeRates/resetExchangeRates',
    payload: exchangeRates
  })),
  catchError(error => of({ 
     type:"exchangeRates/handleError",
     payload: error,
     error: true
  }))
)