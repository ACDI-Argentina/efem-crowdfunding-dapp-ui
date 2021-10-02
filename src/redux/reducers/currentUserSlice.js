import { createSlice } from '@reduxjs/toolkit';
import User from '../../models/User';

/**
 * Estado inicial del usuario.
 */
const currentUserInitialState = {
  status: User.UNREGISTERED.toStore(),
  authenticated: false,
  roles: []
}

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: currentUserInitialState,
  reducers: {
    initCurrentUser: (state, action) => {
      // Cuando se carga el usuario, se obtiene un
      // estado inicial para ir cargándolo desde el Epic.
      const { account } = action.payload;
      state.address = account;
      return state;
    },
    updateCurrentUserBalance: (state, action) => {
      const { balance, tokenBalances } = action.payload;
      state.balance = balance;
      state.tokenBalances = tokenBalances;
      return state;
    },
    setCurrentUser: (state, action) => {
      if (state.address != action.payload.address) {
        console.log("User has been updated in the meanwhile");
        return;
      }
      let currentUserStore = action.payload.toStore();
      state.address = currentUserStore.address;
      state.infoCid = currentUserStore.infoCid;
      state.avatarCid = currentUserStore.avatarCid;
      state.authenticated = currentUserStore.authenticated;
      state.avatar = currentUserStore.avatar;
      state.email = currentUserStore.email;
      state.name = currentUserStore.name;
      state.roles = currentUserStore.roles;
      state.registered = currentUserStore.registered;
      state.url = currentUserStore.url;
      state.status = User.REGISTERED;
      return state;
    },
    registerCurrentUser: (state, action) => {
      const user = action.payload;
      action.payload.status = User.REGISTERING;

      if(!user.address){
        return state; //No hagas ningun cambio
      }

      return action.payload.toStore();
    },
    clearCurrentUser: (state, action) => {
      const initial = {};
      initial.status = User.UNREGISTERED.toStore();
      initial.authenticated = false;
      initial.roles = [];
      return initial;
    }
  },
});

export const { registerCurrentUser, initCurrentUser, updateCurrentUserBalance, setCurrentUser, clearCurrentUser } = currentUserSlice.actions;

export const selectCurrentUser = state => new User(state.currentUser);
export const selectRoles = state => state.currentUser.roles;

export default currentUserSlice.reducer;