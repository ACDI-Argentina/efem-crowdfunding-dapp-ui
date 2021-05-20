import BigNumber from "bignumber.js";
import { Map } from "immutable";

/**
 * Modelo de Wallet.
 *
 * @attribute name          Nombre de la wallet.
 * @attribute logoUrl       URL con la imagen del logo de la wallet.
 * @attribute networkId     Identificador de la red de la wallet.
 */
class Wallet {

  constructor(data = {}) {
    const {
      name = null,
      logoUrl = null,
      networkId = null
    } = data;

    if (data) {
      this._name = name;
      this._logoUrl = logoUrl;
      this._networkId = networkId;
    }
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get logoUrl() {
    return this._logoUrl;
  }

  set logoUrl(value) {
    this._logoUrl = value;
  }

  get networkId() {
    return this._networkId;
  }

  set networkId(value) {
    this._networkId = value;
  }
}

export default Wallet;