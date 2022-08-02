import { Message, Severity } from '@acdi/efem-dapp';
import { store } from '../store';
import { addMessage } from '../reducers/messagesSlice';

/**
 * Clase utilitaria para el manejo de mensajes
 * a través de Redux.
 */
class MessageUtils {

  constructor() { }

  /**
   * Agrega un mensaje de información para ser mostrado al usuario.
   * 
   * @param data datos del mensaje
   */
  addMessageInfo({
    title,
    text = '',
  }) {
    let message = new Message({
      title: title,
      text: text,
      severity: Severity.INFO
    });
    this.dispatchMessage(message);
  }

  /**
   * Agrega un mensaje de éxito para ser mostrado al usuario.
   * 
   * @param data datos del mensaje
   */
  addMessageSuccess({
    title,
    text = '',
  }) {
    let message = new Message({
      title: title,
      text: text,
      severity: Severity.SUCCESS
    });
    this.dispatchMessage(message);
  }

  /**
   * Agrega un mensaje de advertencia para ser mostrado al usuario.
   * 
   * @param data datos del mensaje
   */
  addMessageWarn({
    title,
    text = '',
  }) {
    let message = new Message({
      title: title,
      text: text,
      severity: Severity.WARN
    });
    this.dispatchMessage(message);
  }

  /**
   * Agrega un mensaje de error para ser mostrado al usuario.
   * 
   * @param data datos del mensaje
   */
  addMessageError({
    title,
    text = '',
    error
  }) {
    let message = new Message({
      title: title,
      text: text,
      severity: Severity.ERROR,
      error: error
    });
    this.dispatchMessage(message);
  }

  /**
   * Despacha un mensaje en el store Redux para ser mostrado al usuario.
   * 
   * @param message mensaje a mostrar al usuario.
   */
  dispatchMessage(message) {
    store.dispatch(addMessage(message));
  }
}

export default new MessageUtils();
