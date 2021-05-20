import React, { useContext, Component } from 'react';
import ReactDOM from 'react-dom';

import { Helmet } from 'react-helmet';

import { Router } from 'react-router-dom';

import localforage from 'localforage';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Sweetalert from 'sweetalert';

import GA from 'lib/GoogleAnalytics';

import { history } from '../lib/helpers';

import config from '../configuration';

// components
//import MainMenu from '../components/MainMenu';
import Loader from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';

// context providers
import ConversionRateProvider from '../contextProviders/ConversionRateProvider';
import WhiteListProvider, { Consumer as WhiteListConsumer } from '../contextProviders/WhiteListProvider';

import '../lib/validators';
import { connect } from 'react-redux'
import { fetchDacs } from '../redux/reducers/dacsSlice'
import { fetchCampaigns } from '../redux/reducers/campaignsSlice'
import { fetchMilestones } from '../redux/reducers/milestonesSlice'
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import { fetchUsers } from '../redux/reducers/usersSlice';
import { fetchExchangeRates } from '../redux/reducers/exchangeRatesSlice'
import MessageViewer from '../components/MessageViewer';
import SwitchRoutes from './SwitchRoutes';
import initExchangeRateListener from "../lib/blockchain/listeners/exchangeRateListener"
import TransactionViewer from 'components/TransactionViewer';
import Web3Banner from 'lib/blockchain/Web3Banner';
import Web3App from 'lib/blockchain/Web3App';
import { Web3AppContext } from 'lib/blockchain/Web3App';

/* global document */
/**
 * Here we hack to make stuff globally available
 */
// Make sweet alert global
React.swal = Sweetalert;

// Construct a dom node to be used as content for sweet alert
React.swal.msg = reactNode => {
  const wrapper = document.createElement('span');
  ReactDOM.render(reactNode, wrapper);
  return wrapper.firstChild;
};

// make toast globally available
React.toast = toast;

/**
 * This container holds the application and its routes.
 * It is also responsible for loading application persistent data.
 * As long as this component is mounted, the data will be persistent,
 * if passed as props to children.
 * -> moved to data to UserProvider
 */
class Application extends Component {
  constructor(props) {
    super(props);

    localforage.config({
      name: 'dapp',
    });

    this.state = {
      web3Loading: false,
      whiteListLoading: true,
    };

    this.web3Loaded = this.web3Loaded.bind(this);
    this.whiteListLoaded = this.whiteListLoaded.bind(this);
  }

  componentDidMount() {
    this.props.fetchDacs();
    this.props.fetchCampaigns();
    this.props.fetchMilestones();
    this.props.fetchUsers();
    this.props.fetchExchangeRates();
    initExchangeRateListener();
  }

  web3Loaded() {
    this.setState({ web3Loading: false });
  }

  whiteListLoaded() {
    this.setState({ whiteListLoading: false });
  }



  render() {
    const { web3Loading, whiteListLoading } = this.state;
    const { currentUser } = this.props;
    const userLoading = false; //TODO: pass to a currentUserSlice

    return (
      <ErrorBoundary>
        <Web3App>
          <Web3App.Consumer>
            {({
              network,
              walletBrowserRequired
            }) => (

              <React.Fragment>

                <TransactionViewer></TransactionViewer>
                <MessageViewer></MessageViewer>

                <WhiteListProvider onLoaded={this.whiteListLoaded}>
                  <WhiteListConsumer>
                    {({ state: { fiatWhitelist } }) => (
                      <div>
                        {whiteListLoading && <Loader className="fixed" />}
                        {!whiteListLoading && (
                          <div>
                            {web3Loading && <Loader className="fixed" />}
                            {!web3Loading && (
                              <ConversionRateProvider fiatWhitelist={fiatWhitelist}>
                                <Router history={history}>
                                  <div>
                                    {GA.init() && <GA.RouteTracker />}

                                    {userLoading && <Loader className="fixed" />}

                                    {!userLoading && (
                                      <div>
                                        <SwitchRoutes
                                          currentUser={currentUser}
                                        />
                                      </div>
                                    )}
                                    <ToastContainer
                                      position="top-right"
                                      type="default"
                                      autoClose={5000}
                                      hideProgressBar
                                      newestOnTop={false}
                                      closeOnClick
                                      pauseOnHover
                                    />
                                    <Web3Banner
                                      currentNetwork={network.id}
                                      requiredNetwork={config.network.requiredId}
                                      isCorrectNetwork={network.isCorrect}
                                      walletBrowserRequired={walletBrowserRequired}
                                    />
                                  </div>
                                </Router>
                              </ConversionRateProvider>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </WhiteListConsumer>
                </WhiteListProvider>
              </React.Fragment>
            )}
          </Web3App.Consumer>
        </Web3App>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = {
  fetchDacs,
  fetchCampaigns,
  fetchMilestones,
  fetchUsers,
  fetchExchangeRates
}

Application.contextType = Web3AppContext;

export default connect(mapStateToProps, mapDispatchToProps)(Application)