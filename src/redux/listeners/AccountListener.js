import currentUserUtils from 'redux/utils/currentUserUtils';
import { accountManager } from '../../commons';

/**
 * Listener encargado de escuchar y procesar cambios sobre la cuenta actual.
 */
class AccountListener {

  constructor() {
    this.accountAddress = null;
    accountManager.getAccount().subscribe(a => {
      this.processAccount(a);
    });
  }

  processAccount = (a) => {

    if (a.address == null) {
      // La cuenta no está definida.
      this.accountAddress = null;
      currentUserUtils.clearCurrentUser();
    } else if (a.address !== this.accountAddress) {
      // Se definió una nueva cuenta.
      this.accountAddress = a.address;
      currentUserUtils.loadCurrentUser(a.address);
    } else {
      // La cuenta cambió sus datos.
      // TODO Implementar un método de actualización más general.
      currentUserUtils.updateCurrentUserBalance(a.balance, a.tokenBalances);
    }
  }
}

export default AccountListener;