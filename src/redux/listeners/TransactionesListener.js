import { addOrUpdateTransaction } from 'redux/reducers/transactionsSlice';
import { transactionManager } from '../../commons';
import { store } from '../store';

/**
 * Listener encargado de escuchar y procesar cambios sobre las transacciones.
 */
class TransactionsListener {

  constructor() {
    transactionManager.getTransaction().subscribe(transaction => {
      this.processTransaction(transaction);
    });
  }

  /**
   * Agrega la última tranasacción al store de Redux.
   */
  processTransaction = (transaction) => {
    if(transaction) {
      store.dispatch(addOrUpdateTransaction(transaction));
    }    
  }
}

export default TransactionsListener;