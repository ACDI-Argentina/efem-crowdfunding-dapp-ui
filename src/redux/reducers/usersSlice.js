import { createSlice } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { User } from '@acdi/efem-dapp';
import { web3Utils } from 'commons';

export const usersSlice = createSlice({
    name: 'users',
    initialState: [], //List of User instances with roles
    reducers: {
        fetchUserByAddress: (state, action) => {
            // Solo se obtiene el estado actual.
        },
        /**
         * Incorpora el user al estado global.
         */
        mergeUser: (state, action) => {
            let userStore = action.payload.toStore();
            let index = state.findIndex(u => u.address === userStore.address);
            if (index != -1) {
                // El usuario ya existe localmente,
                // por lo que se realiza un merge de sus datos con los actuales.
                state[index] = merge(state[index], userStore);
            } else {
                // El usuario es nuevo localmente
                state.push(userStore);
            }
        },
        fetchUsers: (state, action) => {
            // Solo se obtiene el estado actual.
        },
        mergeUsers: (state, action) => {
            for (let i = 0; i < action.payload.length; i++) {
                let userStore = action.payload[i].toStore();
                let index = state.findIndex(u => u.address === userStore.address);
                if (index != -1) {
                    // El usuario ya existe localmente,
                    // por lo que se realiza un merge de sus datos con los actuales.
                    state[index] = merge(state[index], userStore);
                } else {
                    // El usuario es nuevo localmente
                    state.push(userStore);
                }
            }
        }
    },
});

/**
 * Realiza el merge del estado de un usuario con uno nuevo.
 * 
 * Si los datos nuevos están definidos, se priorizan por sobre el estado actual.
 * 
 */
function merge(stateUser, newUser) {
    let address = stateUser.address;
    let name = newUser.name !== '' ? newUser.name : stateUser.name;
    let email = newUser.email !== '' ? newUser.email : stateUser.email;
    let url = newUser.url !== '' ? newUser.url : stateUser.url;
    let avatar = newUser.avatar !== '' ? newUser.avatar : stateUser.avatar;
    let infoCid = newUser.infoCid !== '' ? newUser.infoCid : stateUser.infoCid;
    let avatarCid = newUser.avatarCid !== '' ? newUser.avatarCid : stateUser.avatarCid;
    let roles = newUser.roles.length !== 0 ? newUser.roles : stateUser.roles;
    let balance = newUser.balance !== new BigNumber(0) ? newUser.balance : stateUser.balance;
    let registered = newUser.registered === true ? newUser.registered : stateUser.registered;
    return {
        address,
        name,
        email,
        url,
        infoCid,
        avatarCid,
        avatar,
        roles,
        balance,
        registered
    };
}

export const { fetchUserByAddress, fetchUsers } = usersSlice.actions;

export const selectUserByAddress = (state, address) => {
    let userStore = state.users.find(u => web3Utils.addressEquals(u.address, address));
    if(userStore) {
        return new User(userStore);
    }
    return undefined;
}
export const selectUsersByRoles = (state, roles) => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.hasAnyRoles(roles));
}
export const delegates = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isDelegate());
}
export const campaignManagers = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isCampaignManager());
}
export const campaignReviewers = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isCampaignReviewer());
}
export const milestoneManagers = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isMilestoneManager());
}
export const milestoneReviewers = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isMilestoneReviewer());
}
export const recipients = state => {
    return state.users.map(userStore => new User(userStore)).filter(user => user.isRecipient());
}

export default usersSlice.reducer;
