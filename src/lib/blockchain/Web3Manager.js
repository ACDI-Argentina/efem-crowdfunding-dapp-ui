import Web3 from 'web3';
import Web3HttpProvider from 'web3-providers-http';
import Web3Modal from 'web3modal';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BehaviorSubject } from 'rxjs'
import config from '../../configuration';
import ipfsService from '../../ipfs/IpfsService';
import Wallet from 'models/Wallet';

//TODO: determinar cuales es el mejor lugar para posicionar esto, creo que web3manager
const providerOptions = {
  // read more about providers setup in https://github.com/web3Modal/web3modal/
  walletconnect: {
    package: WalletConnectProvider, // setup wallet connect for mobile wallet support
    options: {
    rpc: {
        30: 'https://public-node.rsk.co',
        31: 'https://public-node.testnet.rsk.co',
        33: config.network.nodeUrl,
      },
    },
  },
};

const web3Modal = new Web3Modal({
  providerOptions: providerOptions
});



/**
 * Manager encargado de manejar el objeto Web3.
 */
class Web3Manager {

  constructor() {
    this.connectWeb3ByHttp();
    this.getWeb3().subscribe(async web3 => {
      await this.handleWeb3Changed(web3);
    });
  }

  /**
   * Conecta Web3 con HTTP Provider.
   */
  connectWeb3ByHttp = () => {
    const provider = new Web3HttpProvider(config.network.nodeUrl, {
      keepAlive: true,
      timeout: config.network.timeout,
    });
    const web3 = new Web3(provider);
    web3.providerName = "Http";
    web3.networkId = config.network.requiredId;
    web3.walletBrowserRequired = false;
    // Almacenamiento de Web3
    if (!this.web3Subject) {
      this.web3Subject = new BehaviorSubject(web3);
    } else {
      this.web3Subject.next(web3);
    }
    // Almacenamiento de la dirección de la cuenta.
    if (!this.accountAddressSubject) {
      this.accountAddressSubject = new BehaviorSubject(null);
    } else {
      this.accountAddressSubject.next(null);
    }    
    console.log('[Setup Web3] Conectado por HTTP Provider.', provider);
    console.log('[Setup Web3] Web3.', web3);
    return web3;
  }

  /**
   * Conecta Web3 a partir la Wallet del Browser si es posible.
   */
  async connectWeb3ByWalletBrowser() {

    let web3;
    let walletBrowserRequired = true;
    let walletNetworkId = undefined;
    let walletNetworkIsCorrect = false;

    if (window.ethereum) {
      walletBrowserRequired = false;
      try {
        // Request account access if needed
        // https://eips.ethereum.org/EIPS/eip-1102
        // https://eips.ethereum.org/EIPS/eip-1193
        const accounts = await window.ethereum.send('eth_requestAccounts');
        console.log('[Setup Web3] Browser Wallet accounts.', accounts);
        if (accounts.result && accounts.result.length > 0) {
          web3 = new Web3(window.ethereum);
          walletNetworkId = await web3.eth.net.getId();
          web3.providerName = "WalletBrowser";
          web3.networkId = walletNetworkId;
          walletNetworkIsCorrect = walletNetworkId === config.network.requiredId;
        } else {
          console.warn('[Setup Web3] No hay cuenta habilitada en Browser Wallet.');
        }
      } catch (error) {
        // User denied account access
        console.warn('[Setup Web3] Acceso no autorizado a la dapp en Browser Wallet.');
      }
    }

    if (walletBrowserRequired || !walletNetworkIsCorrect) {
      // La wallet no está instalada o la red es incorrecta.
      // Se inicializa Web3 a partir de HTTP Provider.
      console.warn(`[Setup Web3] Wallet Browser - Requerida: ${walletBrowserRequired}; Red correcta: ${walletNetworkIsCorrect}.`);
      web3 = this.connectWeb3ByHttp();
    } else {
      console.log('[Setup Web3] Conectado por Wallet Browser.');
    }

    // Propiedades propias de una wallet.
    // Obtener el nombre y logo de la wallet en runtime o por la wallet seleccionada.
    web3.wallet = new Wallet({
      name: "MetaMask", 
      logoUrl: ipfsService.resolveUrl('/ipfs/QmPXPzGjVAh6UJUh3MRTKTeXY4dhjZoLVCD225fLJiLeop'),
      networkId: walletNetworkId
    });
    web3.walletBrowserRequired = walletBrowserRequired;

    this.web3Subject.next(web3);
    console.log('[Setup Web3] Web3.', web3);
    return web3;
  }

  /**
   * DEPRECADO - Solamente lo usa web3App(loginAccount) -
   * Del manejo de wallet connect se encarga web3modal 
   * Conecta Web3 con Wallet Connect.
   * 
   * https://walletconnect.org
   * 
   */
  connectWeb3ByWalletConnect = async () => {

    const provider = new WalletConnectProvider({
      rpc: {
        30: "https://public-node.rsk.co",
        31: "https://public-node.testnet.rsk.co",
        33: config.network.nodeUrl
      }
    });

    // Enable session (triggers QR Code modal)
    await provider.enable();
    return await this.setWalletConnectProvider(provider)
  }


  setWalletConnectProvider = async (provider) => {
    const walletBrowserRequired = false;
    let walletNetworkId;
    let walletNetworkIsCorrect = false;

    const web3 = new Web3(provider);

    walletNetworkId = await web3.eth.net.getId();
    web3.providerName = "WalletConnect";
    web3.networkId = walletNetworkId;
    walletNetworkIsCorrect = walletNetworkId === config.network.requiredId;

    if (!walletNetworkIsCorrect) {
      // La wallet no está en la red correcta.
      // Se inicializa Web3 a partir de HTTP Provider.
      console.warn(`[Setup Web3] Wallet Connect - Red correcta: ${walletNetworkIsCorrect}.`);
      // Se fuerza la desconexión del provider.
      await provider.disconnect();
      web3 = this.connectWeb3ByHttp();
    } else {
      console.log('[Setup Web3] Conectado por Wallet Connect.');
    }

    // Propiedades propias de una wallet.
    web3.wallet = new Wallet({
      name: "WalletConnect",
      logoUrl: ipfsService.resolveUrl('/ipfs/QmdgSn7DszmWnF7RWukPQjNYv4SN2qFwxMhrtJ8NYWqRxX'),
      networkId: walletNetworkId
    });
    web3.walletBrowserRequired = walletBrowserRequired;

    this.web3Subject.next(web3);
    console.log('[Setup Web3] Web3.', web3);
    return web3;
  }


  async connect(before,after){
    const provider = await web3Modal.connect();

    let web3;

    if(provider instanceof WalletConnectProvider){
      web3 = this.setWalletConnectProvider(provider);
    } else{
      before(); // ejecutar solo si es una funcion
      web3 = await this.connectWeb3ByWalletBrowser(); 
      after(); //
    }

    if(web3.providerName === "Http"){
      web3.isFallbackProvider = true;
    }
  
    return web3;
  }

  /**
   * Desconecta la dapp del Web3 Provider.
   */
  disconnect = async () => {
    let web3 = this.web3Subject.getValue();
    if (web3.providerName === "WalletConnect") {
      await web3.currentProvider.disconnect();
    } else if (web3.providerName === "WalletBrowser") {
      // No se encontró forma de desconectar una wallet browser.
    }
    console.log('[Setup Web3] Desconectado.');
    this.connectWeb3ByHttp();
  }

  /**
   * Manejador interno sobre los cambios en el objeto Web3.
   */
  handleWeb3Changed = async (web3) => {

    if (web3.providerName !== "Http") {

      // Web3 fue configurado a partir de un provider de una wallet.

      // Se obtiene la cuenta.
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        this.accountAddressSubject.next(accounts[0]);
      }

      // Se configuran los listener de los EIP-1193 events.
      // https://eips.ethereum.org/EIPS/eip-1193#events-1
      let provider = web3.currentProvider;

      console.log(`[Web3] EIP-1193 events listeners de provider ${web3.providerName}.`, provider);

      // Event connect
      provider.on('connect', (connectInfo) => {
        console.log('[Web3] Provider event: connect.', connectInfo);
      });

      // Event disconnect
      provider.on('disconnect', (error) => {
        console.log('[Web3] Provider event: disconnect.', error);
        this.connectWeb3ByHttp();
      });

      // Event chainChanged
      provider.on("chainChanged", (chainId) => {
        console.log('[Web3] Provider event: chainChanged.', parseInt(chainId));
        // Se recarga la página por recomendación de MetaMask.
        // https://docs.metamask.io/guide/ethereum-provider.html#chainchanged
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
      });

      // Event accountsChanged
      provider.on("accountsChanged", (accounts) => {
        console.log('[Web3] Provider event: accountsChanged.', accounts);
        if (accounts.length > 0) {
          this.accountAddressSubject.next(accounts[0]);
        }
      });
    }
  }

  /**
   * Obtiene la instancia de Web3 actual.
   * 
   * @returns web3 
   */
  getWeb3() {
    return this.web3Subject.asObservable();
  }

  /**
   * Obtiene la dirección de la cuenta actual.
   * 
   * @returns accountAddress 
   */
   getAccountAddress() {
    return this.accountAddressSubject.asObservable();
  }
}

export default new Web3Manager();
window.web3Manager = new Web3Manager();