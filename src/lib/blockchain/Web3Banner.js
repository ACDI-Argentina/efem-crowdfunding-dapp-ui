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

const NotWeb3Browser = ({ notWeb3CapableBrowserMessage }) => {
  const { t } = useTranslation();
  return (
    <div>
      {notWeb3CapableBrowserMessage === null ? (
        <Box
          flexDirection="column"
          justifyContent="center"
          alignItems="center">
          <Box my={2}>
            <Image
              src={require("assets/img/icons/warning-icon.png")}
              aria-label="Warning"
              size="24px"
            />
          </Box>
          <Box my={2}>
            <Typography variant="subtitle1">
              {t('web3NotWeb3BrowserTitle')}
            </Typography>
            {NetworkUtils.isMobileDevice() ? (
              <Typography variant="caption">
                {t('web3NotWeb3BrowserDescriptionMobile')}
              </Typography>
            ) : (
              <Typography variant="caption">
                {t('web3NotWeb3BrowserDescription')}
              </Typography>
            )}
          </Box>
          {NetworkUtils.isMobileDevice() ? (
            <Box
              flexDirection="row"
              justifyContent="center"
              alignItems="center">
                <a href="https://status.im/" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/status.svg")}
                    aria-label="Status"
                    size="28px"
                  />
                </a>
                <a href="https://play.google.com/store/apps/details?id=org.toshi&hl=es_AR&gl=US" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/coinbase.png")}
                    aria-label="Coinbase"
                    size="28px"
                  />
                </a>
                <a href="https://www.crunchbase.com/organization/cipher-browser" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/cipher.jpg")}
                    aria-label="Cipher"
                    size="28px"
                  />
                </a>
            </Box>
          ) : (
            <Box
              flexDirection="row"
              justifyContent="center"
              alignItems="center">
                <a href="https://www.opera.com/" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/opera.svg")}
                    aria-label="Opera"
                    size="28px"
                  />
                </a>
                <a href="https://www.brave.com/" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/brave.svg")}
                    aria-label="Brave"
                    size="28px"
                  />
                </a>
                <a href="https://www.mozilla.org/" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/firefox.svg")}
                    aria-label="Firefox"
                    size="28px"
                  />
                </a>
                <a href="https://www.google.com/" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/chrome.svg")}
                    aria-label="Chrome"
                    size="28px"
                  />
                </a>
            </Box>
          )}

        </Box>) : (
          notWeb3CapableBrowserMessage
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
      notWeb3CapableBrowserMessage: PropTypes.node,
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
      notWeb3CapableBrowserMessage: null,
      noNetworkAvailableMessage: null,
      onWrongNetworkMessage: null,
    },
  };

  state = {

  };

  componentDidMount() {
    const browserIsWeb3Capable = NetworkUtils.browserIsWeb3Capable();
    this.setState({ browserIsWeb3Capable });
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
      notWeb3CapableBrowserMessage,
      noNetworkAvailableMessage,
      onWrongNetworkMessage,
    } = this.props.children;

    const show = this.state.browserIsWeb3Capable === false ||
        (walletBrowserRequired === true) ||
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
              {this.state.browserIsWeb3Capable === false ? (
                <NotWeb3Browser
                  notWeb3CapableBrowserMessage={notWeb3CapableBrowserMessage}
                />
              ) : walletBrowserRequired === true ? (
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