import { createSlice } from '@reduxjs/toolkit';
import Milestone from '../../models/Milestone';

export const milestonesSlice = createSlice({
  name: 'milestones',
  initialState: [],
  reducers: {
    fetchMilestones: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    fetchMilestone: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    resetMilestones: (state, action) => {
      // Se resguardan las Milestones Pendientes.
      var pendings = state.filter(m => m.status.name === Milestone.PENDING.name);
      state.splice(0, state.length);
      for (let i = 0; i < action.payload.length; i++) {
        let milestoneStore = action.payload[i].toStore();
        state.push(milestoneStore);
      }
      pendings.forEach(m => state.push(m));
    },
    saveMilestone: (state, action) => {
      const milestone = action.payload;
      milestone.status = Milestone.PENDING;
      const milestoneStore = milestone.toStore();
      const index = state.findIndex(m => m.clientId === milestoneStore.clientId);

      if (index != -1) {
        state[index] = milestoneStore;
      } else {
        state.push(milestoneStore);
      }
    },
    updateMilestone: (state, action) => {
      let milestoneStore = action.payload.toStore();
      let index = state.findIndex(m => m.id === milestoneStore.id);
      if (index != -1) {
        state[index] = milestoneStore;
      }
    },
    updateMilestoneByClientId: (state, action) => {
      let milestoneStore = action.payload.toStore();
      let index = state.findIndex(m => m.clientId === milestoneStore.clientId);
      if (index != -1) {
        state[index] = milestoneStore;
      }
    },
    deleteMilestoneByClientId: (state, action) => {
      let milestoneStore = action.payload.toStore();
      let index = state.findIndex(m => m.clientId === milestoneStore.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    },
    complete: (state, action) => {
      let milestoneStore = action.payload.milestone.toStore();
      let index = state.findIndex(m => m.clientId === milestoneStore.clientId);
      if (index != -1) {
        state[index] = milestoneStore;
      }
    },
    cancel: (state, action) => {
      let milestoneStore = action.payload.milestone.toStore();
      let index = state.findIndex(m => m.clientId === milestoneStore.clientId);
      if (index != -1) {
        state[index] = milestoneStore;
      }
    },
    review: (state, action) => {
      let milestoneStore = action.payload.milestone.toStore();
      let index = state.findIndex(m => m.clientId === milestoneStore.clientId);
      if (index != -1) {
        state[index] = milestoneStore;
      }
    },
    withdraw: (state, action) => {
      let milestoneStore = action.payload.toStore();
      let index = state.findIndex(m => m.clientId === milestoneStore.clientId);
      if (index != -1) {
        state[index] = milestoneStore;
      }
    }
  },
});

export const {
  fetchMilestones,
  fetchMilestone,
  resetMilestones,
  saveMilestone,
  updateMilestoneByClientId,
  complete,
  cancel,
  review,
  withdraw } = milestonesSlice.actions;

export const selectMilestone = (state, id) => {
  let milestoneStore = state.milestones.find(m => m.id === id);
  if(milestoneStore) {
    return new Milestone(milestoneStore);
  }
  return undefined;
}
export const selectMilestones = state => {
  return state.milestones.map(function (milestoneStore) {
    return new Milestone(milestoneStore);
  });
}
export const selectMilestonesByCampaign = (state, campaignId) => {
  return state.milestones.filter(m => m.campaignId === campaignId).map(function (milestoneStore) {
    return new Milestone(milestoneStore);
  });
}
export const selectMilestonesByIds = (state, ids) => {
  return state.milestones.filter(m => ids.includes(m.id)).map(function (milestoneStore) {
    return new Milestone(milestoneStore);
  });
}

export default milestonesSlice.reducer;