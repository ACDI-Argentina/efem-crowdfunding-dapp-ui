import BigNumber from "bignumber.js";
import { Map } from "immutable";

/**
 * Modelo de Account.
 *
 * @attribute address       Dirección de la cuenta.
 * @attribute balance       Balance nativo de la cuenta
 * @attribute tokenBalances Balance de los tokens de la cuenta.
 */
class Account {

  constructor(data = {}) {
    const {
      address = null,
      balance = new BigNumber(0),
      tokenBalances = Map()
    } = data;

    if (data) {
      this._address = address;
      this._balance = balance;
      this._tokenBalances = tokenBalances;
    }
  }

  get address() {
    return this._address;
  }

  set address(value) {
    this._address = value;
  }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this._balance = value;
  }

  get tokenBalances() {
    return this._tokenBalances;
  }

  set tokenBalances(value) {
    this._tokenBalances = value;
  }
}

export default Account;