import { ofType } from 'redux-observable';
import { map, mergeMap } from 'rxjs/operators'
import userService from '../../commons';
import authService from '../../commons';

/**
 * Epic que reacciona a la acción de obtención del usuario actual local,
 * busca el usuario actual con el servicio y envía la acción de
 * resetear el usuario actual.
 * 
 * @param action$ de Redux.
 */
export const loadCurrentUserEpic = (action$, state$) => action$.pipe(
  ofType('currentUser/loadCurrentUser'),
  mergeMap(action =>
    userService.loadUserByAddress(action.payload).pipe(
      mergeMap(currentUser => authService.login(currentUser)),
      map(currentUser => ({
        type: 'currentUser/setCurrentUser',
        payload: currentUser
      }))
    )
  )
)

export const registerCurrentUserEpic = (action$, state$) => action$.pipe(
  ofType('currentUser/registerCurrentUser'),
  mergeMap(action =>
    userService.saveCurrentUser(action.payload).pipe(
      mergeMap(currentUser => authService.login(currentUser)),
      map(currentUser => ({
        type: 'currentUser/setCurrentUser',
        payload: currentUser
      }))
    )
  )
)

export const setCurrentUserEpic = (action$) => action$.pipe(
  ofType('currentUser/setCurrentUser'),
  map(action => ({
    type: 'users/mergeUser',
    payload: action.payload
  }))
)