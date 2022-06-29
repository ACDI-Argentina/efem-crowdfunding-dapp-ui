import { ofType } from 'redux-observable';
import { map, mergeMap, catchError } from 'rxjs/operators'
import UserService from '../../services/UserService';
import { of } from 'rxjs';
import User from '../../models/User'

const userService = new UserService();

/**
 * Epic que reacciona a la acción de obtención del usuario actual local,
 * busca el usuario actual con el servicio y envía la acción de
 * resetear el usuario actual.
 * 
 * @param action$ de Redux.
 */
export const loadCurrentUserEpic = (action$, state$) => action$.pipe(
  ofType('currentUser/initCurrentUser'),
  mergeMap(action => {
    let currentUser = new User(state$.value.currentUser);
    return userService.loadCurrentUser(currentUser);
  }),
  map(currentUser => ({
    type: 'currentUser/setCurrentUser',
    payload: currentUser
  }))
)

export const registerCurrentUserEpic = (action$) => action$.pipe(
  ofType('currentUser/registerCurrentUser'),
  mergeMap(
    action => userService.save(action.payload).pipe(
      map(currentUser => ({
        type: 'currentUser/setCurrentUser',
        payload: currentUser
      })),
      catchError(error => of({
        type: 'currentUser/initCurrentUser',
        payload: error, error: true
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

