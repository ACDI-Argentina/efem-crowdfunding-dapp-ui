import { CrowdfundingAbi, ExchangeRateProviderAbi } from '@acdi/give4forests-crowdfunding-contract';
import getWeb3 from './getWeb3';
import config from '../../configuration';
import Web3Manager from './Web3Manager';
import { Observable } from 'rxjs';
import EventEmitter from 'events';

const { crowdfundingAddress, exchangeRateProviderAddress } = config;
const web3Manager = new Web3Manager();


class NetworkManager {
  constructor() {
    if (!NetworkManager._instance) {
      this.events = new EventEmitter();
      this.listenWeb3Changes();
      NetworkManager._instance = this;
    }
    return NetworkManager._instance;
  }

  listenWeb3Changes(){
    console.log("listenWeb3Changes")
    web3Manager.getWeb3Observable().subscribe({
      next: web3 => { 
        this.web3 = web3;
        this.updateContracts();
        console.log(this.web3);
       },
      error: _ => { },
      complete: _ => { },
    });

  }

  updateContracts(){
    const web3 = this.web3;
    this.crowdfunding = new web3.eth.Contract(CrowdfundingAbi, crowdfundingAddress);
    this.exchangeRateProvider = new web3.eth.Contract(ExchangeRateProviderAbi, exchangeRateProviderAddress);

    this.events.emit("crowdfunding", this.crowdfunding);
    this.events.emit("exchangeRateProvider", this.exchangeRateProvider);
  }

/* 
  async getNetwork() {
    //needs web3, podemos devolver un observable?
    if(this.crowdfunding && this.exchangeRateProvider){
      return {
        ...config,
        crowdfunding: this.crowdfunding,
        exchangeRateProvider: this.exchangeRateProvider,
      }
    }
    if (!this.web3Promise) {
      this.web3Promise = web3Manager.getWeb3();
    }   

    return {
      ...config,
      crowdfunding: this.crowdfunding,
      exchangeRateProvider: this.exchangeRateProvider,
    }
  }

  getConfig() {
    return { ...config };
  }
 */
  getCrowdfundingObservable() {
    return new Observable(subscriber => {
      if(this.crowdfunding){
        subscriber.next(this.crowdfunding);
      }
      this.events.on('crowdfunding', crowdfunding => subscriber.next(crowdfunding));
    });
  }

  getExchangeRateProviderObservable() {
    return new Observable(subscriber => {
      if(this.exchangeRateProvider){
        subscriber.next(this.exchangeRateProvider);
      }
      this.events.on('exchangeRateProvider', exchangeRateProvider => subscriber.next(exchangeRateProvider));
    });
  }
}

export default NetworkManager;

window.networkManager = new NetworkManager();