import React from "react";
import {
  Heading,
  Text,
  Modal,
  Flex,
  Box,
  Loader,
  Image,
  Link,
  Icon,
  Tooltip,
  Button
} from "rimble-ui";
import ModalCard from './ModalCard';
import { withTranslation } from 'react-i18next';
import config from '../../../configuration'
import Web3App from '../Web3App'
import { connect } from 'react-redux'
import { selectCurrentUser } from '../../../redux/reducers/currentUserSlice'
import Web3Utils from "../Web3Utils";
import CryptoAmount from "components/CryptoAmount";
import FiatAmountByToken from "components/FiatAmountByToken";
import { selectLastCreated } from '../../../redux/reducers/transactionsSlice';

class TransactionCreatedModal extends React.Component {

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

        if (transaction.isCreated && isDifferentTransaction) {
          this.setState({
            isOpen: true
          });
        }

      } else {

        // El transaction modal está abierto        

        if (!transaction.isCreated) {
          this.setState({
            isOpen: false
          });
        }
      }
    }
  }

  getWalletImage = wallet => {
    if (wallet.logoUrl) {
      return (
        <Image
          src={wallet.logoUrl}
          aria-label={wallet.name}
          title={wallet.name}
          size="30px"
        />
      )
    } else {
      return null;
    }
  }

  closeModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }
    this.setState({
      isOpen: false
    });
  };

  render() {
    const { currentUser, transaction, t } = this.props;
    const { isOpen } = this.state;
    if (!transaction) {
      return null;
    }
    return (
      <Web3App.Consumer>
        {
          ({
            web3,
            network
          }) =>
            <Modal isOpen={isOpen}>
              <ModalCard closeFunc={this.closeModal}>
                <ModalCard.Body>
                  <Box >
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      borderBottom={1}
                      borderColor="near-white"
                      pb={3}
                    >
                      {this.getWalletImage(web3.wallet)}

                      <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
                        {t(transaction.createdTitle.key, transaction.createdTitle.args)}
                      </Heading>
                    </Flex>
                    <Flex justifyContent={"space-between"} flexDirection={"column"}>
                      <Text textAlign="center">
                        {t(transaction.createdSubtitle.key, transaction.createdSubtitle.args)}
                      </Text>
                      <Flex
                        alignItems={"stretch"}
                        flexDirection={"column"}
                        borderRadius={2}
                        borderColor={"moon-gray"}
                        borderWidth={1}
                        borderStyle={"solid"}
                        overflow={"hidden"}
                        my={[3, 4]}
                      >
                        {/*<Box bg={"primary"} px={3} py={2}>
                          <Text color={"white"}>Conference ticket</Text>
                        </Box>*/}
                        <Flex
                          p={3}
                          borderBottom={"1px solid gray"}
                          borderColor={"moon-gray"}
                          alignItems={"center"}
                          flexDirection={["column", "row"]}
                        >
                          <Box
                            position={"relative"}
                            height={"2em"}
                            width={"2em"}
                            mr={[0, 3]}
                            mb={[3, 0]}
                          >
                            <Box position={"absolute"} top={"0"} left={"0"}>
                              <Loader size={"2em"} />
                            </Box>
                          </Box>
                          <Box>
                            <Text
                              textAlign={["center", "left"]}
                              fontWeight={"600"}
                              fontSize={1}
                              lineHeight={"1.25em"}
                            >
                              {t('transactionWaitConfirmationTitle')}
                            </Text>
                            <Link fontWeight={100} lineHeight={"1.25em"} color={"primary"}>
                              {t('transactionWaitConfirmationDescription')}
                            </Link>
                          </Box>
                        </Flex>

                        <Flex
                          justifyContent={"space-between"}
                          bg="light-gray"
                          py={[2, 3]}
                          px={3}
                          alignItems={"center"}
                          borderBottom={"1px solid gray"}
                          borderColor={"moon-gray"}
                          flexDirection={["column", "row"]}
                        >
                          <Text
                            textAlign={["center", "left"]}
                            color="near-black"
                            fontWeight="bold"
                          >
                            {t('transactionNetwork')}
                          </Text>
                          <Flex
                            alignItems={["center", "flex-end"]}
                            flexDirection={["row", "column"]}
                          >
                            <Text
                              mr={[2, 0]}
                              color="near-black"
                              fontWeight="bold"
                              lineHeight={"1em"}
                            >
                              {network.name}
                            </Text>
                          </Flex>
                        </Flex>

                        <Flex
                          justifyContent={"space-between"}
                          bg="near-white"
                          p={[2, 3]}
                          borderBottom={"1px solid gray"}
                          borderColor={"moon-gray"}
                          flexDirection={["column", "row"]}
                        >
                          <Text
                            textAlign={["center", "left"]}
                            color="near-black"
                            fontWeight="bold"
                          >
                            {t('transactionAccount')}
                          </Text>
                          <Link
                            href={config.network.explorer + 'address/' + currentUser.address}
                            target={"_blank"}
                          >
                            <Tooltip message={currentUser.address}>
                              <Flex
                                justifyContent={["center", "auto"]}
                                alignItems={"center"}
                                flexDirection="row-reverse"
                              >
                                <Text fontWeight="bold">
                                  {Web3Utils.abbreviateAddress(currentUser.address)}
                                </Text>
                                <Flex
                                  mr={2}
                                  p={1}
                                  borderRadius={"50%"}
                                  bg={"primary-extra-light"}
                                  height={"2em"}
                                  width={"2em"}
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Icon color={"primary"} name="RemoveRedEye" size={"1em"} />
                                </Flex>
                              </Flex>
                            </Tooltip>
                          </Link>
                        </Flex>

                        <Flex
                          justifyContent={"space-between"}
                          bg="light-gray"
                          py={[2, 3]}
                          px={3}
                          alignItems={"center"}
                          borderBottom={"1px solid gray"}
                          borderColor={"moon-gray"}
                          flexDirection={["column", "row"]}
                        >
                          <Flex alignItems={"center"}>
                            <Text
                              textAlign={["center", "left"]}
                              color="near-black"
                              fontWeight="bold"
                            >
                              {t('transactionEstimatedFee')}
                            </Text>
                            <Tooltip
                              message={t('transactionEstimatedFeeDescription')}
                              position="top"
                            >
                              <Icon
                                ml={1}
                                name={"InfoOutline"}
                                size={"14px"}
                                color={"primary"}
                              />
                            </Tooltip>
                          </Flex>
                          <Flex
                            alignItems={["center", "flex-end"]}
                            flexDirection={["row", "column"]}
                          >
                            <Text
                              mr={[2, 0]}
                              color="near-black"
                              fontWeight="bold"
                              lineHeight={"1em"}
                            >
                              {<FiatAmountByToken amount={transaction.feeEstimated} />}
                            </Text>
                            <Text color="mid-gray" fontSize={1}>
                              <CryptoAmount amount={transaction.feeEstimated} />
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex
                          justifyContent={"space-between"}
                          bg={"near-white"}
                          p={[2, 3]}
                          alignItems={"center"}
                          flexDirection={["column", "row"]}
                        >
                          <Text color="near-black" fontWeight="bold">
                            {t('transactionEstimatedTime')}
                          </Text>
                          <Text color={"mid-gray"}>
                            {t('transactionEstimatedTimeValue', {
                              transactionEstimatedTime: config.network.transactionEstimatedTime
                            })}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Box>
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
    transaction: selectLastCreated(state)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(TransactionCreatedModal)
);
