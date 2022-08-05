import { createSlice } from '@reduxjs/toolkit';
import { Role } from '@acdi/efem-dapp';
import config from 'configuration';

export const rolesSlice = createSlice({
    name: 'roles',
    initialState: config.roles,
    reducers: {

    }
});

export const selectRoles = state => {
    return state.roles.map(function (roleStore) {
        return new Role(roleStore);
    });
}

export default rolesSlice.reducer;
