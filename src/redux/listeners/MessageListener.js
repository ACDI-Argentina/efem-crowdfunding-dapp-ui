import { addMessage } from 'redux/reducers/messagesSlice';
import { messageManager } from '../../commons';
import { store } from '../store';

/**
 * Listener encargado de escuchar y procesar cambios sobre los mensajes del sistema.
 */
class MessageListener {

  constructor() {
    messageManager.getMessage().subscribe(message => {
      this.processMessage(message);
    });
  }

  processMessage = (message) => {
    if(message != null) {
      store.dispatch(addMessage(message));
    }
  }
}

export default MessageListener;