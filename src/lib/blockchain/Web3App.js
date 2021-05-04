import React from "react";
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import getWeb3 from './getWeb3';
import NetworkUtils from "./NetworkUtils";
import ConnectionModalUtil from "./ConnectionModalsUtil";
import TransactionUtil from "./TransactionUtil";
import config from '../../configuration';
import { connect } from 'react-redux';
import { initCurrentUser, updateCurrentUserBalance, clearCurrentUser } from '../../redux/reducers/currentUserSlice';
import BigNumber from 'bignumber.js';
import { feathersClient } from '../feathersClient';
import Web3Utils from "./Web3Utils";
import { history } from '../helpers';
import { utils } from 'web3';
import erc20ContractApi from '../../lib/blockchain/ERC20ContractApi';
const { Map } = require('immutable');
import Web3Manager from "./Web3Manager";

const web3Manager = new Web3Manager();

const POLL_ACCOUNTS_INTERVAL = 3000;

export const AppTransactionContext = React.createContext({
  contract: {},
  account: {},
  accountBalance: {},
  accountBalanceLow: {},
  web3: {},
  web3Provider: {},
  web3Fallback: {},
  transactions: {},
  checkPreflight: () => { },
  initWeb3: () => { },
  initContract: () => { },
  initAccount: () => { },
  rejectAccountConnect: () => { },
  accountValidated: {},
  accountValidationPending: {},
  rejectValidation: () => { },
  validateAccount: () => { },
  connectAndValidateAccount: () => { },
  network: {
    required: {},
    current: {},
    isCorrectNetwork: null,
    checkNetwork: () => { }
  },
  explorer: undefined,
  modals: {
    data: {
      noWeb3BrowserModalIsOpen: {},
      noWalletModalIsOpen: {},
      connectionModalIsOpen: {},
      accountConnectionPending: {},
      accountSignatureRequest: {},
      userRejectedConnect: {},
      accountValidationPending: {},
      userRejectedValidation: {},
      wrongNetworkModalIsOpen: {},
      transactionConnectionModalIsOpen: {},
      lowFundsModalIsOpen: {}
    },
    methods: {
      openNoWeb3BrowserModal: () => { },
      closeNoWeb3BrowserModal: () => { },
      closeConnectionPendingModal: () => { },
      openConnectionPendingModal: () => { },
      closeUserRejectedConnectionModal: () => { },
      openUserRejectedConnectionModal: () => { },
      closeValidationPendingModal: () => { },
      openValidationPendingModal: () => { },
      closeUserRejectedValidationModal: () => { },
      openUserRejectedValidationModal: () => { },
      closeWrongNetworkModal: () => { },
      openWrongNetworkModal: () => { },
      closeTransactionConnectionModal: () => { },
      openTransactionConnectionModal: () => { },
      closeLowFundsModal: () => { },
      openLowFundsModal: () => { }
    }
  },
  transaction: {
    data: {
      transactions: {}
    },
    meta: {},
    methods: {}
  }
});

class AppTransaction extends React.Component {
  static Consumer = AppTransactionContext.Consumer;

  constructor(props) {
    super(props);
    this.config = {
      requiredNetwork: config.network.requiredId,
      explorer: config?.network?.explorer,
      accountBalanceMinimum: 0.001
    }

    this.pollAccountsRef = React.createRef();
    this.listenEthereumChangesRef = React.createRef();
    this.connectedRef = React.createRef();
  }

  web3Preflight = () => {
    // Is this browser compatible?
    if (!this.state.validBrowser) {
      console.log("Invalid browser, cancelling transaction.");
      let modals = { ...this.state.modals };
      modals.data.noWeb3BrowserModalIsOpen = true;
      this.setState({ modals });
    }

    // Is there a web3 provider?
    if (!this.state.web3) {
      console.log("No browser wallet, cancelling transaction.");
      let modals = { ...this.state.modals };
      modals.data.noWalletModalIsOpen = true;
      this.setState({ modals });
      return false;
    }

    return true;
  };

  web3ActionPreflight = () => {
    // Is this browser compatible?
    if (!this.state.validBrowser) {
      console.log("Invalid browser, cancelling transaction.");
      let modals = { ...this.state.modals };
      modals.data.noWeb3BrowserModalIsOpen = true;
      this.setState({ modals });
      return false;
    }

    // Is there a wallet?
    if (this.state.web3Fallback) {
      console.log("No browser wallet, cancelling transaction.");
      let modals = { ...this.state.modals };
      modals.data.noWalletModalIsOpen = true;
      this.setState({ modals });
      return false;
    }

    // Is it on the correct network?
    if (!this.state.network.isCorrectNetwork) {
      // wrong network modal
      this.state.modals.methods.openWrongNetworkModal();
      return false;
    }

    return true;
  };

  // Validates user's browser is web3 capable
  checkModernBrowser = async () => {
    const validBrowser = NetworkUtils.browserIsWeb3Capable();

    this.setState({
      validBrowser
    });

    return validBrowser;
  };

  // Initialize a web3 provider
  // TODO: Make async work
  initWeb3 = async () => {
    this.checkModernBrowser();
    const web3 = await web3Manager.getWeb3();

    // Set fallback property, used to show modal
    this.setState({ web3Fallback: !web3.isThereWallet });

    this.setState({ web3 }, () => {
      // After setting the web3 provider, check network
      this.checkNetwork();
    });

    console.log("Finished initWeb3");
  };

  initContract = async (address, abi) => {
    console.log("Init contract");

    if (!this.state.web3) {
      console.log("Awaiting web3");
      await this.initWeb3();
    }

    this.createContract(address, abi);
  };

  createContract = async (address, abi) => {
    console.log("creating contract", address, abi);
    // Create contract on initialized web3 provider with given abi and address
    try {
      const contract = new this.state.web3.eth.Contract(abi, address);
      this.setState({ contract });
    } catch (error) {
      console.log("Could not create contract.");
      window.toastProvider.addMessage("Contract creation failed.", {
        variant: "failure"
      });
    }
  };


  onAccountsChanged = (accounts) => {
    if(!this.connectedRef.current){
      return;
    }
    
    console.log("accounts changed!")
    const account = accounts[0];
    if (account) {
      this.setState({ account }, () => {
        this.initCurrentUser(); //Esto a veces puede demorar, y hace que se nos cargue un usuario cuando ya estaá desconectado
        // After account is complete, get the balance
        this.getAccountBalances(account);
      });
    } else {
      this.closeAccount();
    }
  };

  onChainChanged = (chainID) => {
    console.log("Update dapp - new network:",chainID)
  }

  

  walletConnect = async () => {
    console.log('Init wallet connect Provider');
    const provider = new WalletConnectProvider({
      rpc:{
        30: "https://public-node.rsk.co",
        31:"https://public-node.testnet.rsk.co"
      }
    });

    await provider.enable();

    provider.on('connect', () => {
      console.log('connected!');
    });

    provider.on("disconnect", (code, reason) => {
      console.log("provider disconnected!",code,reason);
      this.setState({web3Provider: undefined});
      this.closeAccount();
    });

    web3Manager.updateWeb3(provider); 

    const web3 = await web3Manager.getWeb3();
    const accounts = await web3.eth.getAccounts();
    if (accounts.length && accounts[0]) {
      const account = accounts[0];
      this.setState({ web3, account, web3Provider:"WalletConnect" }, () => {
        console.log(`%c[${new Date().toISOString()}] New account over wallet connect`,"color:yellow;font-weight:bold;");
        this.initCurrentUser(); 
        this.getAccountBalance(account);
      });
    }
    
  }

  
  initAccount = async () => {
    this.openConnectionPendingModal();

    // First try EIP 1102 Connect method
    if (window.ethereum) {
      try {
        const { ethereum } = window;
        // Request account access if needed
        //https://eips.ethereum.org/EIPS/eip-1102
        //https://eips.ethereum.org/EIPS/eip-1193
        const response = await ethereum.request({
          method: "eth_requestAccounts",
        });
    
        const accounts = response || [];
        console.log(accounts);
        const account = accounts[0];

        this.connectedRef.current = true;
        this.closeConnectionPendingModal();
        this.setState({ account });

        this.initCurrentUser();


        //set provider
        this.setState({web3Provider: "Metamask"});

        // Watch for account change
        //this.pollAccountUpdates(); //TODO: cambiar esto por un handler ethereum.on("accountsChanged",..
        if(!this.listenEthereumChangesRef.current){
          ethereum.on('accountsChanged', this.onAccountsChanged);
          ethereum.on('chainChanged', this.onChainChanged);
          this.listenEthereumChangesRef.current = true;
        }
        
        // After account is complete, get the balance
        this.getAccountBalances(account);

      } catch (error) {
        console.log("User cancelled connect request. Error:", error);
        this.closeConnectionPendingModal();

        // Reject Connect
        this.rejectAccountConnect(error);
      }
    } else {
      // Revert back to directly getting wallet address
      try {
        const account = window.web3.eth.accounts[0];
        this.closeConnectionPendingModal();
        this.setState({ account });

        console.log("fallback wallet address:", this.state.account);

        // After account is complete, get the balance
        this.getAccountBalances(account);

        // Watch for account change
        // TODO: This type of wallet browser probably doesn't inject window.ethereum
        // this.pollAccountUpdates();
      } catch (error) {
        console.log("Could not get account address. Error: ", error);

        // Reject Connect
        // TODO: This needs a new modal
        this.rejectAccountConnect(error);
      }
    }
  };


  closeAccount = () => {
    console.log("closeAccount")
    clearInterval(this.pollAccountsRef.current);
    this.props.clearCurrentUser();
    this.connectedRef.current = false;
  }



  initCurrentUser = async () => {
    const { account } = this.state;
    this.props.initCurrentUser({
      account: account
    });
  }

  updateCurrentUserBalance = async () => {
    const { accountBalance, accountTokenBalances } = this.state;
    this.props.updateCurrentUserBalance({
      balance: accountBalance,
      tokenBalances: accountTokenBalances
    });
  }

  // TODO: Can this be moved/combined?
  rejectAccountConnect = error => {
    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = false;
    modals.data.userRejectedConnect = true;
    this.setState({ modals });
  };

  getAccountBalances = async account => {
    const localAccount = account ? account : this.state.account;
    if (localAccount) {

      try {

        let accountTokenBalances = this.state.accountTokenBalances;

        // Se obtiene el balance del token nativo.
        await this.state.web3.eth
          .getBalance(localAccount)
          .then(balance => {
            if (!isNaN(balance)) {
              balance = new BigNumber(balance);
              // Only update if changed
              if (!balance.isEqualTo(this.state.accountBalance)) {
                this.setState({ accountBalance: balance });
                accountTokenBalances[config.nativeToken.address] = balance;
                //this.determineAccountLowBalance();
              }
            } else {
              this.setState({ accountBalance: "--" });
              console.error("Error al obtener el balance.", balance);
            }
          });

        // Se obtienen los balances de cada ERC20 token.        
        Object.keys(config.tokens).map(async tokenKey => {
          try {
            if(config.tokens[tokenKey].isNative === false) {
              let address = config.tokens[tokenKey].address;
              let balance = await erc20ContractApi.getBalance(address, localAccount);
              accountTokenBalances[address] = balance;
              console.log('Balance de usuario.', address, balance, accountTokenBalances);
            } 
          } catch(e) {
            console.error('Error obteniendo balance de ERC Token.', config.tokens[tokenKey], e);
          } 
        });
        this.setState({ accountTokenBalances: accountTokenBalances });

        this.updateCurrentUserBalance();

      } catch (error) {
        console.error("Error al obtener los balances.", error);
      }
    } else {
      console.warn("No hay cuenta para obtener los balances.");
      return false;
    }
  };

  determineAccountLowBalance = () => {
    // If provided a minimum from http://192.168.1.103:3000/ then use it, else default to 1
    const accountBalanceMinimum =
      typeof this.config !== "undefined" &&
        typeof this.config.accountBalanceMinimum !== "undefined"
        ? this.config.accountBalanceMinimum
        : 1;
    // Determine if the account balance is low
    const accountBalanceLow =
      this.state.accountBalance < accountBalanceMinimum ? true : false;

    this.setState({
      accountBalanceLow
    });

    if (
      accountBalanceLow === false &&
      this.state.modals.data.lowFundsModalIsOpen
    ) {
      this.closeLowFundsModal();

      window.toastProvider.addMessage("Received Funds!", {
        variant: "success",
        secondaryMessage: "You now have enough ETH"
      });
    }
  };

  validateAccount = async () => {
    // Get account wallet if none exist
    if (!this.state.account) {
      await this.initAccount();

      if (!this.state.account) {
        return;
      }
    }
    console.log("setting state to update UI");

    // Show blocking modal
    this.openValidationPendingModal();

    console.log("Requesting web3 personal sign");
    return window.web3.personal.sign(
      window.web3.fromUtf8(
        `Hi there from Rimble! To connect, sign this message to prove you have access to this account. This won’t cost you any Ether.

        Message ID: 48d4f84f-f402-4268-8af4-a692fabff5da (this is for security, you don’t need to remember this)`
      ),
      this.state.account,
      (error, signature) => {
        if (error) {
          // User rejected account validation.
          console.log("Wallet account not validated. Error:", error);

          // Reject the validation
          this.rejectValidation(error);

          if (this.state.callback) {
            this.state.callback("error");
          }
        } else {
          const successMessage = "Connected!";
          console.log(successMessage, signature);
          window.toastProvider.addMessage(successMessage, {
            variant: "success",
            secondaryMessage: "Welcome to the Rimble Demo App 🎉"
          });

          this.closeValidationPendingModal();
          this.setState({
            accountValidated: true
          });

          if (this.state.callback) {
            this.state.callback("success");
          }
        }
      }
    );
  };

  rejectValidation = error => {
    let modals = { ...this.state.modals };
    modals.data.userRejectedValidation = true;
    modals.data.accountValidated = false;
    modals.data.accountValidationPending = false;
    this.setState({ modals });
  };

  connectAndValidateAccount = async callback => {
    if (!this.web3ActionPreflight()) {
      return;
    }

    // Check for account
    if (!this.state.account || !this.state.accountValidated) {
      // Show modal to connect account
      this.openConnectionModal(null, callback);
    }

    // await this.initAccount();
    // await this.validateAccount();
  };

  getRequiredNetwork = () => {
    const networkId =
      typeof this.config !== "undefined" &&
        typeof this.config.requiredNetwork !== "undefined"
        ? this.config.requiredNetwork
        : 1;
    let networkName = "";
    switch (networkId) {
      case 1:
        networkName = "Main";
        break;
      case 3:
        networkName = "Ropsten";
        break;
      case 4:
        networkName = "Rinkeby";
        break;
      case 30:
        networkName = 'RSK Mainnet';
        break;
      case 31:
        networkName = 'RSK Testnet';
        break;
      case 33:
        networkName = 'RSK Regtest';
        break;
      case 42:
        networkName = "Kovan";
        break;
      default:
        networkName = "unknown";
    }

    let requiredNetwork = {
      name: networkName,
      id: networkId
    };

    let network = { ...this.state.network };
    network.required = requiredNetwork;

    this.setState({ network });
  };

  getNetworkId = /*async*/ () => {
    let current = { ...this.state.network.current };
    current.id = this.state.web3.walletNetworkId;
    current.name = NetworkUtils.getEthNetworkNameById(current.id);
    let network = { ...this.state.network };
    network.current = current;
    this.setState({ network });
    /*try {
      return this.state.web3.eth.net.getId((error, networkId) => {
        let current = { ...this.state.network.current };
        current.id = networkId;
        let network = { ...this.state.network };
        network.current = current;
        this.setState({ network });
      });
    } catch (error) {
      console.log("Could not get network ID: ", error);
    }*/
  };

  /*getNetworkName = async () => {
     try {
       return this.state.web3.eth.net.getNetworkType((error, networkName) => {
         let current = { ...this.state.network.current };
         current.name = networkName;
         let network = { ...this.state.network };
         network.current = current;
         this.setState({ network });
       });
     } catch (error) {
       console.log("Could not get network Name: ", error);
     }
   };*/

  checkNetwork = async () => {
    this.getRequiredNetwork();
    await this.getNetworkId();
    //await this.getNetworkName();

    let network = { ...this.state.network };
    /*network.isCorrectNetwork = 
      this.state.network.current.id === this.state.network.required.id
        ? true
        : false;*/
    network.isCorrectNetwork = this.state.web3.walletIsCorrectNetwork;

    this.setState({ network }, () => {
      // Is there a wallet?
      if (!this.state.web3Fallback) {
        //this.initAccount(); // A este init account tenemos que llamarlo como resultado de una acción del usuario 
      }
    });
  };

  pollAccountUpdates = () => {
    console.log("poll account updates")
    let account = this.state.account;
    let requiresUpdate = false;

    let accountInterval = setInterval(async () => {
      if (
        this.state.modals.data.accountValidationPending ||
        this.state.modals.data.accountConnectionPending
      ) {
        return;
      }
      if (window.ethereum.isConnected()) {
        const updatedAccount = (await window.ethereum.request({ method: 'eth_accounts' }))[0];

        if (updatedAccount && (updatedAccount.toLowerCase() !== account.toLowerCase())) {
          requiresUpdate = true;
        }

        this.getAccountBalances();

        if (requiresUpdate && this.pollAccountsRef.current) {
          clearInterval(accountInterval);
          let modals = { ...this.state.modals };
          modals.data.userRejectedConnect = null;

          this.setState(
            {
              modals: modals,
              account: "",
              accountValidated: null,
              transactions: []
            },
            () => {
              this.initAccount();
            }
          );
        }
      }
    }, POLL_ACCOUNTS_INTERVAL);
    this.pollAccountsRef.current = accountInterval;
  };

  contractMethodSendWrapper = (contractMethod, callback) => {
    console.log("contractMethodSendWrapper Callback: ", callback);
    // Is it web3 capable?
    if (!this.web3ActionPreflight()) {
      return;
    }

    // Is a wallet connected and verified?
    if (!this.state.account || !this.state.accountValidated) {
      this.openTransactionConnectionModal(null, () => {
        console.log("Successfully connected, continuing with Tx");
        this.contractMethodSendWrapper(contractMethod, callback);
      });
      return;
    }

    // Are there a minimum amount of funds?
    if (this.state.accountBalanceLow) {
      this.openLowFundsModal(null, () => { });
      return;
    }

    // Is the contract loaded?

    // Create new tx and add to collection
    // Maybe this needs to get moved out of the wrapper?
    let transaction = this.createTransaction();
    this.addTransaction(transaction);

    // Add meta data to transaction
    transaction.method = contractMethod;
    transaction.type = "contract";
    transaction.status = "started";

    console.log("transaction: ", { ...transaction });

    // Show toast for starting transaction
    this.updateTransaction(transaction);

    const { contract, account } = this.state;

    try {
      contract.methods[contractMethod]()
        .send({ from: account })
        .on("transactionHash", hash => {
          // Submitted to block and received transaction hash
          // Set properties on the current transaction
          transaction.transactionHash = hash;
          transaction.status = "pending";
          transaction.recentEvent = "transactionHash";
          this.updateTransaction(transaction);
          if (callback) {
            callback("transactionHash", transaction);
          }
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          // Update confirmation count on each subsequent confirmation that's received
          transaction.confirmationCount += 1;

          // How many confirmations should be received before informing the user
          const confidenceThreshold = 3;

          if (transaction.confirmationCount === 1) {
            // Initial confirmation receipt
            transaction.status = "confirmed";
          } else if (transaction.confirmationCount < confidenceThreshold) {
            // Not enough confirmations to match threshold
          } else if (transaction.confirmationCount === confidenceThreshold) {
            // Confirmations match threshold
            // Check the status from result since we are confident in the result
            if (receipt.status) {
              transaction.status = "success";
            } else if (!receipt.status) {
              transaction.status = "error";
            }
          } else if (transaction.confirmationCount > confidenceThreshold) {
            // Confidence threshold met
          }
          // Update transaction with receipt details
          transaction.recentEvent = "confirmation";
          this.updateTransaction(transaction);
          if (callback) {
            callback("confirmation", transaction);
          }
        })
        .on("receipt", receipt => {
          // Received receipt, met total number of confirmations
          transaction.recentEvent = "receipt";
          this.updateTransaction(transaction);
          if (callback) {
            callback("receipt", transaction);
          }
        })
        .on("error", error => {
          // Errored out
          transaction.status = "error";
          transaction.recentEvent = "error";
          this.updateTransaction(transaction);
          // TODO: should this be a custom error? What is the error here?
          // TODO: determine how to handle error messages globally
          window.toastProvider.addMessage("Value change failed", {
            secondaryMessage: "Could not change value.",
            actionHref: "",
            actionText: "",
            variant: "failure"
          });
          if (callback) {
            callback("error: " + error, transaction);
          }
        });
    } catch (error) {
      transaction.status = "error";
      this.updateTransaction(transaction);
      // TODO: should this be a custom error? What is the error here?
      // TODO: determine how to handle error messages globally
      window.toastProvider.addMessage("Value change failed", {
        secondaryMessage: "Could not change value on smart contract",
        actionHref: "",
        actionText: "",
        variant: "failure"
      });
      if (callback) {
        callback("error: " + error, error);
      }
    }
  };

  // Create tx
  createTransaction = () => {
    let transaction = {};
    transaction.created = Date.now();
    transaction.lastUpdated = Date.now();
    transaction.status = "initialized";
    transaction.confirmationCount = 0;

    return transaction;
  };

  addTransaction = transaction => {
    const transactions = { ...this.state.transactions };
    console.log("addTransaction: ", { ...transaction });
    transactions[`tx${transaction.created}`] = transaction;
    this.setState({ transactions });
  };

  // Add/update transaction in state
  updateTransaction = updatedTransaction => {
    const transactions = { ...this.state.transactions };
    const transaction = { ...updatedTransaction };
    transaction.lastUpdated = Date.now();
    transactions[`tx${updatedTransaction.created}`] = transaction;
    this.setState({ transactions });
  };

  // UTILITY
  shortenHash = hash => {
    let shortHash = hash;
    const txStart = shortHash.substr(0, 7);
    const txEnd = shortHash.substr(shortHash.length - 4);
    shortHash = txStart + "..." + txEnd;
    return shortHash;
  };

  // CONNECTION MODAL METHODS
  closeConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.connectionModalIsOpen = false;
    console.log("this.state", this.state);
    this.setState({ modals });
  };

  openConnectionModal = (e, callback) => {
    if (typeof e !== "undefined" && e !== null) {
      console.log(e);
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.connectionModalIsOpen = true;
    this.setState({ modals: modals, callback: callback });
  };

  closeConnectionPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = false;
    this.setState({ modals });
  };

  openConnectionPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = true;
    modals.data.transactionConnectionModalIsOpen = false;
    modals.data.connectionModalIsOpen = false;

    this.setState({ modals });
  };

  closeSignatureRequestModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountSignatureRequest = false;
    this.setState({ modals });
  };

  openSignatureRequestModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountSignatureRequest = true;
    modals.data.transactionConnectionModalIsOpen = false;
    modals.data.connectionModalIsOpen = false;

    this.setState({ modals });
  };

  closeUserRejectedConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedConnect = false;
    this.setState({ modals });
  };

  openUserRejectedConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedConnect = true;
    this.setState({ modals });
  };

  closeValidationPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountValidationPending = false;
    modals.data.connectionModalIsOpen = false;
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  openValidationPendingModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.accountConnectionPending = false;
    modals.data.transactionConnectionModalIsOpen = false;
    modals.data.accountValidationPending = true;
    modals.data.userRejectedValidation = false;
    this.setState({ modals });
  };

  closeUserRejectedValidationModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedValidation = false;
    modals.data.connectionModalIsOpen = false;
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  openUserRejectedValidationModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.userRejectedValidation = true;
    modals.data.connectionModalIsOpen = false;
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  closeNoWeb3BrowserModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWeb3BrowserModalIsOpen = false;
    this.setState({ modals });
  };

  openNoWeb3BrowserModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWeb3BrowserModalIsOpen = true;
    this.setState({ modals });
  };

  closeNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = false;
    this.setState({ modals });
  };

  openNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = true;
    this.setState({ modals });
  };

  closeNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = false;
    this.setState({ modals });
  };

  openNoWalletModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.noWalletModalIsOpen = true;
    this.setState({ modals });
  };

  closeWrongNetworkModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.wrongNetworkModalIsOpen = false;
    this.setState({ modals });
  };

  openWrongNetworkModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.wrongNetworkModalIsOpen = true;
    this.setState({ modals });
  };

  closeTransactionConnectionModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.transactionConnectionModalIsOpen = false;
    this.setState({ modals });
  };

  openTransactionConnectionModal = (e, callback) => {
    if (typeof e !== "undefined" && e !== null) {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.transactionConnectionModalIsOpen = true;
    this.setState({ modals, callback: callback });
  };

  closeLowFundsModal = e => {
    if (typeof e !== "undefined") {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.lowFundsModalIsOpen = false;
    this.setState({ modals });
  };

  openLowFundsModal = (e, callback) => {
    if (typeof e !== "undefined" && e !== null) {
      e.preventDefault();
    }

    let modals = { ...this.state.modals };
    modals.data.lowFundsModalIsOpen = true;
    this.setState({ modals, callback: callback });
  };

  /*isLoggedIn = async (currentUser) => {
    new Promise((resolve, reject) => {
      if (currentUser && currentUser.address && currentUser.authenticated) resolve();
      else {
        authenticateIfPossible(currentUser);
        reject();
      }
    });
  };*/


  authenticateIfPossible = async (currentUser) => {

    if (currentUser && currentUser.address && currentUser.authenticated) {
      return true;
    }

    currentUser.authenticated = await this.authenticate(currentUser.address);

    return currentUser.authenticated;
  };

  authenticate = async (address, redirectOnFail = true) => {
    const web3 = await getWeb3();
    const authData = {
      strategy: 'web3',
      address,
    };
    const accessToken = await feathersClient.passport.getJWT();
    if (accessToken) {
      const payload = await feathersClient.passport.verifyJWT(accessToken);
      if (Web3Utils.addressEquals(address, payload.userId)) {
        await feathersClient.authenticate(); // authenticate the socket connection
        return true;
      }
      await feathersClient.logout();
    }

    try {
      await feathersClient.authenticate(authData);
      return true;
    } catch (response) {
      // normal flow will issue a 401 with a challenge message we need to sign and send to
      // verify our identity
      if (response.code === 401 && response.data.startsWith('Challenge =')) {
        const msg = response.data.replace('Challenge =', '').trim();
        console.log('Mensaje', msg);
        /*const res = await React.swal({
          title: 'You need to sign in!',
          text:
            // 'By signing in we are able to provide instant updates to the app after you take an action. The signin process simply requires you to verify that you own this address by signing a randomly generated message. If you choose to skip this step, the app will not reflect any actions you make until the transactions have been mined.',
            'In order to provide the best experience possible, we are going to ask you to sign a randomly generated message proving that you own the current account. This will enable us to provide instant updates to the app after any action.',
          icon: 'info',
          buttons: [false, 'OK'],
        });*/

        this.openSignatureRequestModal();

        /*if (!res) {
          if (redirectOnFail) history.goBack();
          return false;
        }*/

        /*React.swal({
          title: 'Please sign the MetaMask transaction...',
          text:
            "A MetaMask transaction should have popped-up. If you don't see it check the pending transaction in the MetaMask browser extension. Alternatively make sure to check that your popup blocker is disabled.",
          icon: 'success',
          button: false,
        });*/

        // we have to wrap in a timeout b/c if you close the chrome window MetaMask opens, the promise never resolves
        const signOrTimeout = () =>
          new Promise(async resolve => {
            const timeOut = setTimeout(() => {
              resolve(false);
              history.goBack();
              //React.swal.close();
              this.closeSignatureRequestModal();
            }, 30000);

            try {
              const signature = await web3.eth.personal.sign(msg, address);
              authData.signature = signature;
              await feathersClient.authenticate(authData);
              //React.swal.close();
              this.closeSignatureRequestModal();
              clearTimeout(timeOut);
              resolve(true);
            } catch (e) {
              console.error('Error firmando mensaje de autenticación', e);
              clearTimeout(timeOut);
              history.goBack();
              resolve(false);
            }
          });

        return signOrTimeout();
      }
    }
    return false;
  };

  checkProfile = async (currentUser) => {
    // already created a profile
    if (!currentUser || currentUser.name) return;
    const redirect = await React.swal({
      title: 'Please Register!',
      text: 'It appears that you have not yet created your profile. In order to gain the trust of givers, we strongly recommend creating your profile!',
      icon: 'info',
      buttons: ['Skip', 'Create My Profile!'],
    });
    if (redirect) history.push('/profile');
  };

  checkBalance = (balance) => {
    new Promise(resolve => {
      const minimumWalletBalance = 0.000005;
      const minimumWalletBalanceInWei = new BigNumber(
        utils.toWei(new BigNumber(minimumWalletBalance).toString()),
      );
      if (balance && balance.gte(minimumWalletBalanceInWei)) {
        resolve();
      } else {
        React.swal({
          title: 'Insufficient wallet balance',
          content: React.swal.msg(
            <p>
              Unfortunately you need at least {minimumWalletBalance} {config.nativeTokenName} in
              your wallet to continue. Please transfer some ${config.nativeTokenName} to your wallet
              first.
            </p>,
          ),
          icon: 'warning',
        });
      }
    });
  };

  state = {
    contract: {},
    account: null,
    accountBalance: null,
    accountTokenBalances: Map(),
    accountBalanceLow: null,
    web3: null,
    web3Provider: null,
    web3Fallback: null,
    transactions: {},
    checkPreflight: this.checkPreflight,
    initWeb3: this.initWeb3,
    initContract: this.initContract,
    initAccount: this.initAccount,
    closeAccount: this.closeAccount,
    walletConnect: this.walletConnect, //TODO: REFACT
    contractMethodSendWrapper: this.contractMethodSendWrapper,
    rejectAccountConnect: this.rejectAccountConnect,
    accountValidated: null,
    accountValidationPending: null,
    rejectValidation: this.rejectValidation,
    validateAccount: this.validateAccount,
    connectAndValidateAccount: this.connectAndValidateAccount,
    network: {
      required: {},
      current: {},
      isCorrectNetwork: null,
      checkNetwork: this.checkNetwork
    },
    modals: {
      data: {
        noWeb3BrowserModalIsOpen: this.noWeb3BrowserModalIsOpen,
        noWalletModalIsOpen: this.noWalletModalIsOpen,
        connectionModalIsOpen: null,
        accountConnectionPending: null,
        accountSignatureRequest: null,
        userRejectedConnect: null,
        accountValidationPending: null,
        userRejectedValidation: null,
        wrongNetworkModalIsOpen: null,
        transactionConnectionModalIsOpen: null,
        lowFundsModalIsOpen: null
      },
      methods: {
        openNoWeb3BrowserModal: this.openNoWeb3BrowserModal,
        closeNoWeb3BrowserModal: this.closeNoWeb3BrowserModal,
        openNoWalletModal: this.openNoWalletModal,
        closeNoWalletModal: this.closeNoWalletModal,
        closeConnectionModal: this.closeConnectionModal,
        openConnectionModal: this.openConnectionModal,
        closeConnectionPendingModal: this.closeConnectionPendingModal,
        openConnectionPendingModal: this.openConnectionPendingModal,
        closeUserRejectedConnectionModal: this.closeUserRejectedConnectionModal,
        openUserRejectedConnectionModal: this.openUserRejectedConnectionModal,
        closeValidationPendingModal: this.closeValidationPendingModal,
        openValidationPendingModal: this.openValidationPendingModal,
        closeUserRejectedValidationModal: this.closeUserRejectedValidationModal,
        openUserRejectedValidationModal: this.openUserRejectedValidationModal,
        closeWrongNetworkModal: this.closeWrongNetworkModal,
        openWrongNetworkModal: this.openWrongNetworkModal,
        closeTransactionConnectionModal: this.closeTransactionConnectionModal,
        openTransactionConnectionModal: this.openTransactionConnectionModal,
        closeLowFundsModal: this.closeLowFundsModal,
        openLowFundsModal: this.openLowFundsModal,
        authenticateIfPossible: this.authenticateIfPossible,
        checkProfile: this.checkProfile,
        checkBalance: this.checkBalance
      }
    },
    transaction: {
      data: {
        transactions: null
      },
      meta: {},
      methods: {}
    }
  };

  componentDidMount() {
    // Performs a check on browser and will load a web3 provider
    this.initWeb3().then(() => {
      console.log('Web3 configurado');
    });

    this.setState({ explorer: config?.network.explorer });
  }

  render() {
    return (
      <div>
        <AppTransactionContext.Provider value={this.state} {...this.props} />
        <ConnectionModalUtil
          initAccount={this.state.initAccount}
          account={this.state.account}
          validateAccount={this.state.validateAccount}
          accountConnectionPending={this.state.accountConnectionPending}
          accountSignatureRequest={this.state.accountSignatureRequest}
          accountValidationPending={this.state.accountValidationPending}
          accountValidated={this.state.accountValidated}
          network={this.state.network}
          modals={this.state.modals}
        />
        <TransactionUtil transaction={this.state.transaction} />
      </div>
    );
  }
}

export default connect(null, { initCurrentUser, updateCurrentUserBalance, clearCurrentUser })(AppTransaction);