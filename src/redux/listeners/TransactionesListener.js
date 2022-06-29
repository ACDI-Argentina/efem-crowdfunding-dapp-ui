import { setTransactions } from 'redux/reducers/transactionsSlice';
import { transactionsManager } from '../../commons';
import { store } from '../store';

/**
 * Listener encargado de escuchar y procesar cambios sobre las transacciones.
 */
class TransactionsListener {

  constructor() {
    transactionsManager.getTransactions().subscribe(transactions => {
      this.processTransactions(transactions);
    });
  }

  processTransactions = (transactions) => {
    store.dispatch(setTransactions(transactions));
  }
}

export default TransactionsListener;