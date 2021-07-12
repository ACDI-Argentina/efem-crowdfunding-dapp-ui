import BigNumber from "bignumber.js";
import { Map } from "immutable";

/**
 * Modelo de Wallet.
 *
 * @attribute name          Nombre de la wallet.
 * @attribute logo       URL con la imagen del logo de la wallet.
 * @attribute networkId     Identificador de la red de la wallet.
 */
class Wallet {

  constructor(data = {}) {
    const {
      name = null,
      logo = null,
      networkId = null
    } = data;

    if (data) {
      this._name = name;
      this._logo = logo;
      this._networkId = networkId;
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get logo() {
    return this._logoUrl;
  }

  set logo(value) {
    this._logo = value;
  }

  get networkId() {
    return this._networkId;
  }

  set networkId(value) {
    this._networkId = value;
  }
}

export default Wallet;