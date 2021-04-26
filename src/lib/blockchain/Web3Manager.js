import Web3 from 'web3';
import Web3HttpProvider from 'web3-providers-http';
import config from '../../configuration';
import { Observable } from 'rxjs'
import EventEmitter from 'events';

class Web3Manager {
  constructor() {
    if (!Web3Manager._instance) {
      this.events = new EventEmitter();
      Web3Manager._instance = this;
    }
    return Web3Manager._instance;
  }

  async initWeb3() {
    console.log("init web3!")
    let web3;

    let web3Wallet;
    let web3Http;
    let isThereWallet = false;
    let walletNetworkId = null;
    let web3HttpProvider;

    if (window.ethereum) {
      this.provider = window.ethereum;
      web3Wallet = new Web3(window.ethereum);
      isThereWallet = true;
      walletNetworkId = await web3Wallet.eth.net.getId();
    }

    const walletIsCorrectNetwork = walletNetworkId === config.network.requiredId;

    if (!walletIsCorrectNetwork) {// La wallet no está instalada o la red es incorrecta.
        web3HttpProvider = new Web3HttpProvider(config.network.nodeUrl, {
        keepAlive: true,
        timeout: config.network.timeout,
      });
      this.provider = web3HttpProvider;
      web3Http = new Web3(web3HttpProvider);
    }

    if (web3Http) {
      console.log('Configuración Web3: HTTP Provider.', web3HttpProvider);
      web3 = web3Http;
    } else {
      console.log('Configuración Web3: Modern Browser Ethereum Provider.');
      web3 = web3Wallet;
    }

    web3.isThereWallet = isThereWallet;
    web3.walletNetworkId = walletNetworkId;
    web3.walletIsCorrectNetwork = walletIsCorrectNetwork;
    web3.ts = new Date().getTime();

    console.log('Configuración Web3', web3);
    this.web3 = web3;
    this.events.emit('web3',this.web3);
    return web3;
  }

  //devuelve el provider actual
  getProvider() {
    return this.provider;
  }

  //actualiza el provider actual y también web3
  updateWeb3(provider) {
    console.log("update web3");
    //check that is valid provider
    window.providerx = provider;
    this.provider = provider;
    this.web3 = new Web3(provider);
    this.events.emit('web3',this.web3);
    return this.web3;
  }

  getWeb3Observable(){
    console.log("getWeb3Observable!")
    this.web3Observable = new Observable(subscriber => {
      if(this.web3){
        subscriber.next(this.web3);
      }
      this.events.on('web3',web3 => subscriber.next(web3));
    });
    return this.web3Observable;
  }

  //Devuelve una instancia de Web3 con el provider actual
  async getWeb3() {
    if (!this.web3) {
       await this.initWeb3();
    }
    return this.web3;
  }

  

}

export default Web3Manager;

window.web3Manager = new Web3Manager();

