import { nanoid } from '@reduxjs/toolkit'
import Model from './Model';

/**
 * Severidad de un mensaje
 */
export const Severity = {
  INFO: 'Info',
  SUCCESS: 'Success',
  WARN: 'Warn',
  ERROR: 'Error'
}



/**
 * Representa un mensaje en la Dapp.
 */
class Message extends Model {

  constructor({
    clientId = nanoid(),
    title,
    text = '',
    severity = Severity.INFO,
    error,
  } = {}) {
    super();
    this._clientId = clientId;
    this._title = title;
    this._text = text;
    this._severity = severity;
    this._error = error;
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      clientId: this._clientId,
      title: this._title,
      text: this._text,
      severity: this._severity,
      // El error no es serializado, pero no debería tener consecuencias porque no se modifica.
      error: this._error
    };
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this.checkType(value, ['string'], 'clientId');
    this._clientId = value;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this.checkType(value, ['string'], 'title');
    this._title = value;
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this.checkType(value, ['string'], 'text');
    this._text = value;
  }

  get severity() {
    return this._severity;
  }

  set severity(value) {
    this._severity = value;
  }

  get error() {
    return this._error;
  }

  set error(value) {
    this._error = value;
  }
}

export default Message;
