import { createSlice } from '@reduxjs/toolkit';
import Activity from '../../models/Activity';

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState: [],
  reducers: {
    fetchActivitiesByIds: (state, action) => {
      // Solo se obtiene el estado actual.
    },
    /**
     * Incorpora las actividades al estado global.
     */
    mergeActivities: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        let activityStore = action.payload[i].toStore();
        let replaced = false;
        for (let j = 0; j < state.length; j++) {
          // Se compara por su ID porque lo comparten aquellas
          // activities que están en persistidas.
          if (state[j].id === activityStore.id) {
            state[j] = activityStore;
            replaced = true;
            break;
          }
        }
        if (!replaced) {
          state.push(activityStore);
        }
      }
    }
  },
});

export const {
  fetchActivitiesByIds,
  mergeActivities } = activitiesSlice.actions;

export const selectActivitiesByIds = (state, ids) => {
  return state.activities.filter(a => ids.includes(a.id)).map(function (activityStore) {
    return new Activity(activityStore);
  });
}

export const selectActivitiesByMilestone = (state, milestoneId) => {
  return state.activities.filter(a => a.milestoneId === milestoneId).map(function (activityStore) {
    return new Activity(activityStore);
  });
}

export default activitiesSlice.reducer;
