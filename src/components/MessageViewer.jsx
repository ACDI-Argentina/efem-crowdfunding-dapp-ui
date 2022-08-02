import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorPopup from '../components/ErrorPopup';
import { Message, Severity } from '@acdi/efem-dapp';
import { connect } from 'react-redux'
import { selectNext, deleteMessage } from '../redux/reducers/messagesSlice';

/**
 * Componente encargado de la visualización de mensajes.
 */
class MessageViewer extends Component {

  constructor() {
    super();
    this.state = {

    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    const { message } = this.props;

    if (message) {

      //console.log('Mensaje a visualizar', message);

      if (message.severity === Severity.INFO) {

        this.showMessageInfo(message);

      } else if (message.severity === Severity.SUCCESS) {

        this.showMessageSuccess(message);

      } else if (message.severity === Severity.WARN) {

        this.showMessageWarn(message);

      } else if (message.severity === Severity.ERROR) {

        this.showMessageError(message);
      }

      // Una vez visualizado el mensaje, es eliminado.
      this.props.deleteMessage(message);
    }
  }

  showMessageInfo(message) {
    React.toast.success(message.text);
  }

  showMessageSuccess(message) {
    React.swal({
      title: message.title,
      text: message.text,
      icon: "success",
    });
  }

  showMessageWarn(message) {
    React.swal({
      title: message.title,
      text: message.text,
      icon: "warning",
    });
  }

  showMessageError(message) {
    ErrorPopup(message.text, message.error);
  }

  render() {
    return null;
  }
}

MessageViewer.propTypes = {
  message: PropTypes.instanceOf(Message)
};

const mapStateToProps = (state, ownProps) => {
  return {
    message: selectNext(state)
  }
}

const mapDispatchToProps = { deleteMessage }

export default connect(mapStateToProps, mapDispatchToProps)(MessageViewer)
