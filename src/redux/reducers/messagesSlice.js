import { createSlice } from '@reduxjs/toolkit'
import { Message } from '@acdi/efem-dapp'

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      let messageStore = action.payload.toStore();
      state.push(messageStore);
    },
    deleteMessage: (state, action) => {
      let messageStore = action.payload.toStore();
      let index = state.findIndex(m => m.clientId === messageStore.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    }
  },
});

export const { addMessage, deleteMessage } = messagesSlice.actions;

export const selectNext = (state) => {
  if (state.messages.length > 0) {
    return new Message(state.messages[0]);
  }
  return undefined;
};

export default messagesSlice.reducer;