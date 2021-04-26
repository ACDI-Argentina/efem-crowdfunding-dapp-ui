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
    console.log("[Network manager] listenWeb3Changes")
    const obs = web3Manager.getWeb3Observable();
    window.web3Obs = obs;
    obs.subscribe({
      next: web3 => { 
        console.log("%cSetting web3 on network manager","color:yellow;font-weigth:bold")
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
    console.log("%ccontracts updated","color:yellow")

  }

  getCrowdfunding(){
    console.log(`%c [${new Date().toISOString()}] GET CROWDFUNDING`, "color:violet");
    if(this.crowdfunding){
      console.log(`%c [${new Date().toISOString()}] return instance`, "color:violet");
      window.crowdfunding = this.crowdfunding;
      return this.crowdfunding;
    } else {
      console.log(`%c [${new Date().toISOString()}] return promise`, "color:violet");
      return new Promise((resolve,reject) => {
        this.events.on("crowdfunding", (crowdfunding) => resolve(crowdfunding));
      });
    }
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