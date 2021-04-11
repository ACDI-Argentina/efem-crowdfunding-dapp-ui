import React, { Component } from 'react';
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

const WrongNetwork = ({
  currentNetwork,
  requiredNetwork,
  onWrongNetworkMessage,
}) => {
  const { t } = useTranslation();
  const requiredNetworkName = NetworkUtils.getEthNetworkNameById(requiredNetwork);
  const currentNetworkName = NetworkUtils.getEthNetworkNameById(currentNetwork);
  return (
    <div>
      {onWrongNetworkMessage === null ? (
        // Show default banner
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
          <Box>
            <Typography variant="subtitle1"
              style={{textDecoration: "underline"}}>
              {t('web3WrongNetworkTitle', {
                requiredNetwork: requiredNetworkName
              })}
            </Typography>
            <Typography variant="caption">
              {t('web3WrongNetworkDescription', {
                requiredNetwork: requiredNetworkName,
                currentNetwork: currentNetworkName
              })}
            </Typography>
          </Box>
        </Box>) : (
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
                    aria-label="Warning"
                    size="28px"
                  />
                </a>
                <a href="https://play.google.com/store/apps/details?id=org.toshi&hl=es_AR&gl=US" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/coinbase.png")}
                    aria-label="Warning"
                    size="28px"
                  />
                </a>
                <a href="https://www.crunchbase.com/organization/cipher-browser" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/cipher.jpg")}
                    aria-label="Warning"
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
                    aria-label="Warning"
                    size="28px"
                  />
                </a>
                <a href="https://www.brave.com/" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/brave.svg")}
                    aria-label="Warning"
                    size="28px"
                  />
                </a>
                <a href="https://www.mozilla.org/" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/firefox.svg")}
                    aria-label="Warning"
                    size="28px"
                  />
                </a>
                <a href="https://www.google.com/" target="_blank"
                  style={{margin: "1em"}}>
                  <Image
                    src={require("assets/img/logos/chrome.svg")}
                    aria-label="Warning"
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
  static propTypes = {
    currentNetwork: PropTypes.number,
    requiredNetwork: PropTypes.number,
    isCorrectNetwork: PropTypes.bool,
    onWeb3Fallback: PropTypes.bool,
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
    onWeb3Fallback: false,
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

  componentDidUpdate() {
    if (this.props.currentNetwork && this.props.requiredNetwork) {
    
    }
  }

  render() {
    const { currentNetwork,
      requiredNetwork,
      onWeb3Fallback,
      transactionFirstPending } = this.props;
    const {
      notWeb3CapableBrowserMessage,
      noNetworkAvailableMessage,
      onWrongNetworkMessage,
    } = this.props.children;

    const bkgImg = require("assets/img/notificacion-bkg.png");

    console.log(this.state.browserIsWeb3Capable === false);
    console.log(onWeb3Fallback === true || currentNetwork === null);
    console.log(this.props.isCorrectNetwork === false);
    console.log(transactionFirstPending !== undefined);
    
    const show = this.state.browserIsWeb3Capable === false ||
        (onWeb3Fallback === true || currentNetwork === null) ||
        this.props.isCorrectNetwork === false ||
        transactionFirstPending !== undefined;
    const display = show ? 'flex' : 'none';

    return (
        <Box
          alignItems="flex-end"
          style={{
            display: display,
            position: 'fixed',
            bottom: '0',
            zIndex: '10',
            textAlign: 'center',
            backgroundImage: "url(" + bkgImg + ")",
            backgroundPosition: "0% 100%",
            backgroundSize: "auto 100%",
            heigth: '300px',
            maxHeigth: '300px',
            width: '100%',
          }}
        >
          <Box style={{
              width: '320px',
              minWidth: '300px',
              padding: '16px 28px',
              marginLeft: '56px',
              height: '250px'
            }}>
              {this.state.browserIsWeb3Capable === false ? (
                <NotWeb3Browser
                  notWeb3CapableBrowserMessage={notWeb3CapableBrowserMessage}
                />
              ) : onWeb3Fallback === true || currentNetwork === null ? (
                <NoNetwork noNetworkAvailableMessage={noNetworkAvailableMessage} />
              ) : this.props.isCorrectNetwork === false ? (
                <WrongNetwork
                  currentNetwork={currentNetwork}
                  requiredNetwork={requiredNetwork}
                  onWrongNetworkMessage={onWrongNetworkMessage}
                />
              ) : null}

              <TransactionProgressBanner
                transaction={transactionFirstPending}>
              </TransactionProgressBanner>
          </Box>
          <Box flexGrow={1}></Box>
        </Box>
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
  withTranslation()(Web3Banner)
)