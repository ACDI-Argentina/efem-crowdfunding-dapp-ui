import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators'
import crowdfundingContractApi from '../../lib/blockchain/CrowdfundingContractApi';

/**
 * Epic que reacciona a la acción de obtención de dacs locales,
 * busca las dacs en el smart contract y envía la acción de
 * resetear las dacs locales.
 * 
 * @param action$ de Redux.
 */
export const fetchDacsEpic = action$ => action$.pipe(
  ofType('dacs/fetchDacs'),
  mergeMap(action => crowdfundingContractApi.getDacs()),
  map(dacs => ({
    type: 'dacs/resetDacs',
    payload: dacs
  }))
)

export const fetchDacEpic = action$ => action$.pipe(
  ofType('dacs/fetchDac'),
  mergeMap(action => crowdfundingContractApi.getDac(action.payload)),
  map(dac => ({
    type: 'dacs/updateDac',
    payload: dac
  }))
)

/**
 * Epic que reacciona a la acción de almacenamiento de dac local,
 * almacena la dac en el smart contract y envía la acción de
 * dac la dac local.
 * 
 * @param action$ de Redux.
 */
export const saveDacEpic = action$ => action$.pipe(
  ofType('dacs/saveDac'),
  mergeMap(action => crowdfundingContractApi.saveDac(action.payload)),
  map(dac => ({
    type: 'dacs/updateDacByClientId',
    payload: dac
  })),
  catchError(error => of({
    type: 'dacs/deleteDacByClientId',
    payload: error.dac
  }))
)