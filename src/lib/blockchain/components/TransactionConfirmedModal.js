import React from "react";
import { Heading, Text, Modal, Flex, Box, Icon } from "rimble-ui";
import ModalCard from './ModalCard';
import { withTranslation } from 'react-i18next';
import Web3App from '../Web3App'
import { connect } from 'react-redux'
import { selectCurrentUser } from '../../../redux/reducers/currentUserSlice'
import { selectLastConfirmed, deleteTransaction } from '../../../redux/reducers/transactionsSlice';
import Link from '@material-ui/core/Link';
import config from '../../../configuration'

class TransactionConfirmedModal extends React.Component {

  constructor() {
    super();
    this.state = {
      isOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidUpdate(prevProps) {

    const { transaction } = this.props;
    const { isOpen } = this.state;

    if (transaction) {

      const prevTransaction = prevProps.transaction;
      const isDifferentTransaction = !prevTransaction || prevTransaction.clientId !== transaction.clientId;

      if (isOpen === false) {

        // El transaction modal está cerrado

        if (transaction.isConfirmed && isDifferentTransaction) {
          this.setState({
            isOpen: true
          });
        }

      } else {

        // El transaction modal está abierto        

        if (!transaction.isConfirmed) {
          this.setState({
            isOpen: false
          });
        }
      }
    }
  }

  closeModal = e => {
    const { transaction, deleteTransaction } = this.props;
    if (typeof e !== "undefined") {
      e.preventDefault();
    }
    this.setState({
      isOpen: false
    });
    deleteTransaction(transaction);
  };

  render() {
    const { transaction, t } = this.props;
    const { isOpen } = this.state;
    if (!transaction) {
      return null;
    }
    
    return (
      <Web3App.Consumer>
        {
          ({
            network
          }) =>
            <Modal isOpen={isOpen}>
              <ModalCard closeFunc={this.closeModal}>
                <ModalCard.Body>
                  <Box height="4px" bg="success" borderRadius={["1rem 1rem 0 0"]} />
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="near-white"
                    p={[3, 4]}
                    pb={3}
                  >
                    <Icon name="CheckCircle" color="success" aria-label="Success" />
                    <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
                      {t(transaction.confirmedTitle.key, transaction.confirmedTitle.args)}
                    </Heading>
                  </Flex>
                  <Box p={[3, 4]} pb={2}>
                    <Text textAlign="center" mt={2}>
                      {t(transaction.confirmedDescription.key, transaction.confirmedDescription.args)}
                    </Text>
                  </Box>
                  <Flex
                    p={[3, 4]}
                    borderTop={1}
                    borderColor="near-white"
                    justifyContent="flex-end"
                    flexDirection={["column", "row"]}
                    alignItems="center"
                  >
                    <Link 
                      href={config.network.explorer + 'tx/' + transaction.hash} 
                      target='_blank'
                    >
                      {t('transactionExplore')}
                    </Link>
                  </Flex>
                </ModalCard.Body>
              </ModalCard>
            </Modal>
        }
      </Web3App.Consumer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    transaction: selectLastConfirmed(state)
  }
}

const mapDispatchToProps = {
  deleteTransaction
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(TransactionConfirmedModal)
);
