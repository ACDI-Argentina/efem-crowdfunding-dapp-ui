import { createSlice } from '@reduxjs/toolkit'
import { Transaction } from '@acdi/efem-dapp'

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: [],
  reducers: {
    addOrUpdateTransaction: (state, action) => {
      let transactionStore = action.payload.toStore();
      let index = state.findIndex(t => t.clientId === transactionStore.clientId);
      if (index != -1) {
        state[index] = transactionStore;
      } else {
        state.push(transactionStore);
      }
    },
    addTransaction: (state, action) => {
      let transactionStore = action.payload.toStore();
      state.push(transactionStore);
    },
    updateTransaction: (state, action) => {
      let transactionStore = action.payload.toStore();
      let index = state.findIndex(t => t.clientId === transactionStore.clientId);
      if (index != -1) {
        state[index] = transactionStore;
      }
    },
    deleteTransaction: (state, action) => {
      let transactionStore = action.payload.toStore();
      let index = state.findIndex(t => t.clientId === transactionStore.clientId);
      if (index != -1) {
        state.splice(index, 1);
      }
    },
    setTransactions: (state, action) => {
      action.payload.forEach(transaction => {
        let transactionStore = transaction.toStore();
        let index = state.findIndex(t => t.clientId === transactionStore.clientId);
        if (index != -1) {
          state[index] = transactionStore;
        } else {
          state.push(transactionStore);
        }
      });
    },
  },
});

export const { addOrUpdateTransaction, addTransaction, updateTransaction, deleteTransaction, setTransactions } = transactionsSlice.actions;

export const selectLastCreated = (state) => {
  let transactionsCreated = state.transactions.filter(t => t.status.name === Transaction.CREATED.name);
  let length = transactionsCreated.length;
  if (length > 0) {
    return new Transaction(transactionsCreated[length - 1]);
  } else {
    return undefined;
  }
};

export const selectFirstPending = (state) => {
  let transactionsPending = state.transactions.filter(t => t.status.name === Transaction.PENDING.name);
  let length = transactionsPending.length;
  if (length > 0) {
    return new Transaction(transactionsPending[0]);
  } else {
    return undefined;
  }
};

export const selectLastConfirmed = (state) => {
  let transactionsConfirmed = state.transactions.filter(t => t.status.name === Transaction.CONFIRMED.name);
  let length = transactionsConfirmed.length;
  if (length > 0) {
    return new Transaction(transactionsConfirmed[length - 1]);
  } else {
    return undefined;
  }
};

export const selectLastFailured = (state) => {
  let transactionsFailured = state.transactions.filter(t => t.status.name === Transaction.FAILURED.name);
  let length = transactionsFailured.length;
  if (length > 0) {
    return new Transaction(transactionsFailured[length - 1]);
  } else {
    return undefined;
  }
};

export default transactionsSlice.reducer;