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
    loadCurrentUser: (state, action) => {
      // Cuando se carga el usuario, se obtiene un
      // estado inicial para ir cargándolo desde el Epic.
      state.address = action.payload;
      return state;
    },
    setAuthenticated:(state,action) => {
      const isAuthenticated = action.payload;
      state.authenticated = isAuthenticated;
    },
 
    updateCurrentUserBalance: (state, action) => {
      const { balance, tokenBalances } = action.payload;
      state.balance = balance;
      state.tokenBalances = tokenBalances;
      return state;
    },
    setCurrentUser: (state, action) => {
      let currentUserStore = action.payload.toStore();
      state.address = currentUserStore.address;
      state.infoCid = currentUserStore.infoCid;
      state.authenticated = currentUserStore.authenticated;
      state.avatar = currentUserStore.avatar;
      state.avatarCid = currentUserStore.avatarCid;
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
        return state;
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

export const { 
  registerCurrentUser, 
  setAuthenticated,
  loadCurrentUser, 
  updateCurrentUserBalance, 
  setCurrentUser, 
  clearCurrentUser 
} = currentUserSlice.actions;

export const selectCurrentUser = state => new User(state.currentUser);
export const selectRoles = state => state.currentUser.roles;

export default currentUserSlice.reducer;