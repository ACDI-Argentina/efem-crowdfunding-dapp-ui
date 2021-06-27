import React, { useContext, Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NetworkUtils from './NetworkUtils';
import { Image, MetaMaskButton } from 'rimble-ui';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { selectLastCreated, selectFirstPending, deleteTransaction } from '../../redux/reducers/transactionsSlice';
import TransactionProgressBanner from './components/TransactionProgressBanner';
import { Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from "assets/jss/material-kit-react/components/web3BannerStyle.js";
import networkManager from './NetworkManager';
import { Web3AppContext } from 'lib/blockchain/Web3App';

import Bounce from 'components/Animated/Bounce';

const WrongNetwork = ({
  currentNetwork,
  requiredNetwork,
  onWrongNetworkMessage,
  lastNotificationTs
}) => {
  const { t } = useTranslation();
  const requiredNetworkName = networkManager.getNetworkNameById(requiredNetwork);
  const currentNetworkName = networkManager.getNetworkNameById(currentNetwork);
  const { web3 } = useContext(Web3AppContext);

  const [bouncing,setBouncing] = useState(false);

  useEffect(() => {
    setBouncing(true);
    const timeoutId = setTimeout(()=> setBouncing(false),500);
    return () => {clearTimeout(timeoutId)}
  },[lastNotificationTs])
  



  return (
    <div>
      {onWrongNetworkMessage === null ? (
        // Show default banner
        <Bounce bouncing={bouncing}>
          <Box
            flexDirection="column"
            justifyContent="center"
            alignItems="center">
            <Box>
              <Image
                src={require("assets/img/icons/warning-icon.png")}
                aria-label="Warning"
                size="24px"
              />
            </Box>
            <Box my={1}>
              <Image
                src={web3.wallet.logoUrl}
                aria-label="MetaMask extension icon"
                size="40px"
              />
            </Box>
            <Box>
              <Typography variant="subtitle1"
                style={{ textDecoration: "underline" }}>
                {t('web3WrongNetworkTitle', {
                  requiredNetwork: requiredNetworkName
                })}
              </Typography>
              <Typography variant="caption">
                {t('web3WrongNetworkDescription', {
                  requiredNetwork: requiredNetworkName,
                  currentNetwork: currentNetworkName,
                  walletName: web3.wallet.name
                })}
              </Typography>
            </Box>
          </Box>
        </Bounce>
        ) : (
          // Show custom banner
          onWrongNetworkMessage
        )}
    </div>
  );
};

const NoNetwork = ({ noNetworkAvailableMessage }) => {
  const { t } = useTranslation();
  return (
    <div>
      {noNetworkAvailableMessage === null ? (
        <Box
          flexDirection="column"
          justifyContent="center"
          alignItems="center">
          <Box>
            <Image
              src={require("assets/img/icons/warning-icon.png")}
              aria-label="Warning"
              size="24px"
            />
          </Box>
          <Box my={1}>
            <Image
              src={require("assets/img/MetaMaskIcon.svg")}
              aria-label="MetaMask extension icon"
              size="40px"
            />
          </Box>
          <Box my={1}>
            <MetaMaskButton
              as="a"
              href="https://metamask.io/"
              target="_blank"
              color={'white'}
              size="small"
            >
              {t('web3InstallMetaMask')}
            </MetaMaskButton>
          </Box>
          <Box>
            <Typography variant="caption">
              {t('web3NoNetwork')}
            </Typography>
          </Box>
        </Box>) : (
          noNetworkAvailableMessage
        )}
    </div>
  );
};
class Web3Banner extends Component {

  constructor(props) {
    super(props);
    this.toogleShowNotificationIcon = this.toogleShowNotificationIcon.bind(this);
  }

  static propTypes = {
    currentNetwork: PropTypes.number,
    requiredNetwork: PropTypes.number,
    isCorrectNetwork: PropTypes.bool,
    walletBrowserRequired: PropTypes.bool,
    children: PropTypes.shape({
      noNetworkAvailableMessage: PropTypes.node,
      onWrongNetworkMessage: PropTypes.node,
    }),
  };
  static defaultProps = {
    currentNetwork: null,
    requiredNetwork: null,
    isCorrectNetwork: true,
    walletBrowserRequired: false,
    children: {
      noNetworkAvailableMessage: null,
      onWrongNetworkMessage: null,
    },
  };

  state = {

  };

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentNetwork && this.props.requiredNetwork) {
    
    }

    if(this.props.lastNotificationTs !== prevProps.lastNotificationTs){
      this.toogleShowNotificationIcon(false);

    }
  }

  toogleShowNotificationIcon(val) {
    this.setState({ showNotificationIcon: val });
  }

  render() {
    const { currentNetwork,
      requiredNetwork,
      walletBrowserRequired,
      transactionFirstPending, 
      classes,
      lastNotificationTs
      
     } = this.props;
    const {
      noNetworkAvailableMessage,
      onWrongNetworkMessage,
    } = this.props.children;

    const show = (walletBrowserRequired === true) ||
        this.props.isCorrectNetwork === false ||
        transactionFirstPending !== undefined;
    const boxDisplay = show ? 'flex' : 'none';

    return (
      <div>
        {this.state.showNotificationIcon ?
          <Image
            src={require("assets/img/icons/warning-icon.png")}
            aria-label="Warning"
            className={classes.toggleShowButton}
            onClick={() => this.toogleShowNotificationIcon(false)}
          />
          : null}
        {!this.state.showNotificationIcon ?
          <Box
            alignItems="flex-end"
            className={classes.notificationLayout}
            style={{
              display: boxDisplay
            }}
          >
            <Image
              src={require("assets/img/icons/close-icon.png")}
              aria-label="Close"
              className={classes.closeButton}
              onClick={() => this.toogleShowNotificationIcon(true)}
            />
            <Box className={classes.notificationBox}>
              {walletBrowserRequired === true ? (
                <NoNetwork noNetworkAvailableMessage={noNetworkAvailableMessage} />
              ) : this.props.isCorrectNetwork === false ? (
                <WrongNetwork
                  currentNetwork={currentNetwork}
                  requiredNetwork={requiredNetwork}
                  onWrongNetworkMessage={onWrongNetworkMessage}
                  lastNotificationTs={lastNotificationTs}
                />
              ) : null}

              <TransactionProgressBanner
                transaction={transactionFirstPending}>
              </TransactionProgressBanner>
            </Box>
          </Box>
          : null}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    transactionCreated: selectLastCreated(state),
    transactionFirstPending: selectFirstPending(state)
  }
}

const mapDispatchToProps = { deleteTransaction }

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation() (Web3Banner)))
);