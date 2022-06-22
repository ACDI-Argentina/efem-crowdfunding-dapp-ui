import React, { Component } from 'react';

import NoWeb3BrowserModal from "./components/NoWeb3BrowserModal";
import NoWalletModal from "./components/NoWalletModal";
import WrongNetworkModal from "./components/WrongNetworkModal";

import ConnectionModal from "./components/ConnectionModal";
import TransactionConnectionModal from "./components/TransactionConnectionModal";
import ConnectionPendingModal from "./components/ConnectionPendingModal";
import UserRejectedConnectionModal from "./components/UserRejectedConnectionModal";

import ValidationPendingModal from "./components/ValidationPendingModal";
import UserRejectedValidationModal from "./components/UserRejectedValidationModal";

import LowFundsModal from "./components/LowFundsModal";
import SignatureRequestModal from "./components/SignatureRequestModal";

class ConnectionModalUtil extends Component {
  render() {
    return (
      <div>
        <NoWeb3BrowserModal
          closeModal={this.props.modals.methods.closeNoWeb3BrowserModal}
          isOpen={this.props.modals.data.noWeb3BrowserModalIsOpen}
          transaction={this.props.transaction}
        />

        <NoWalletModal
          closeModal={this.props.modals.methods.closeNoWalletModal}
          isOpen={this.props.modals.data.noWalletModalIsOpen}
          transaction={this.props.transaction}
        />

        <WrongNetworkModal
          closeModal={this.props.modals.methods.closeWrongNetworkModal}
          isOpen={this.props.modals.data.wrongNetworkModalIsOpen}
          network={this.props.network}
          networkRequired={this.props.networkRequired}
        />

        <ConnectionModal
          closeModal={this.props.modals.methods.closeConnectionModal}
          isOpen={
            this.props.modals.data.connectionModalIsOpen &&
            !this.props.accountValidated
          }
          currentNetwork={this.props.network}
        />

        <TransactionConnectionModal
          closeModal={this.props.modals.methods.closeTransactionConnectionModal}
          isOpen={this.props.modals.data.transactionConnectionModalIsOpen}
          currentNetwork={this.props.network}
        />

        <ConnectionPendingModal
          closeModal={this.props.modals.methods.closeConnectionPendingModal}
          isOpen={this.props.modals.data.accountConnectionPending}
          currentNetwork={this.props.network}
        />

        <SignatureRequestModal 
          closeModal={this.props.modals.methods.closeSignatureRequestModal}
          isOpen={this.props.modals.data.accountSignatureRequest}
        />

        <UserRejectedConnectionModal
          closeModal={
            this.props.modals.methods.closeUserRejectedConnectionModal
          }
          isOpen={this.props.modals.data.userRejectedConnect}
          loginAccount={this.props.loginAccount}
        />

        <ValidationPendingModal
          closeModal={this.props.modals.methods.closeValidationPendingModal}
          isOpen={this.props.modals.data.accountValidationPending}
          currentNetwork={this.props.network}
          account={this.props.account}
        />
        <UserRejectedValidationModal
          closeModal={
            this.props.modals.methods.closeUserRejectedValidationModal
          }
          isOpen={this.props.modals.data.userRejectedValidation}
        />

        <LowFundsModal
          closeModal={this.props.modals.methods.closeLowFundsModal}
          isOpen={this.props.modals.data.lowFundsModalIsOpen}
          currentNetwork={this.props.network}
          account={this.props.account}
        />
      </div>
    );
  }
}

export default ConnectionModalUtil;
