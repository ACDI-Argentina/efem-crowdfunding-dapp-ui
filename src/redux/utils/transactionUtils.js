import { Transaction } from '@acdi/efem-dapp';
import { store } from '../store';
import { addTransaction, updateTransaction } from '../reducers/transactionsSlice';

/**
 * Clase utilitaria para el manejo de transacciones
 * a través de Redux.
 */
class TransactionUtils {

  constructor() { }

  /**
   * Agrega una nueva transacción.
   * 
   * @param data datos de la transacción a agregar.
   */
  addTransaction({
    hash,
    gasEstimated,
    gasPrice,
    createdTitle,
    createdSubtitle,
    pendingTitle,
    confirmedTitle,
    confirmedDescription,
    failuredTitle,
    failuredDescription
  }) {
    let transaction = new Transaction({
      hash: hash,
      gasEstimated: gasEstimated,
      gasPrice: gasPrice,
      createdTitle: createdTitle,
      createdSubtitle: createdSubtitle,
      pendingTitle: pendingTitle,
      confirmedTitle: confirmedTitle,
      confirmedDescription: confirmedDescription,
      failuredTitle: failuredTitle,
      failuredDescription: failuredDescription
    });
    store.dispatch(addTransaction(transaction));
    return transaction;
  }

  /**
   * Actualiza una transacción.
   * 
   * @param data datos de la transacción a actualizar.
   */
  updateTransaction(transaction) {
    store.dispatch(updateTransaction(transaction));
  }
}

export default new TransactionUtils();