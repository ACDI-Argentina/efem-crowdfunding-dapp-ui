
import Web3 from 'web3';
import Web3HttpProvider from 'web3-providers-http';
import config from '../../configuration';

const TRANSACTION_CHECK_INTERVAL_MS = 1000;
const TRANSACTION_TIMEOUT_MS = 300000; //5 min


//Por defecto usamos este provider, ya que al utilizar el de
// wallet connect no obtenermos resultados consistentes
const httpWeb3 = new Web3(new Web3HttpProvider(
  config.network.nodeUrl, {
  keepAlive: true,
  timeout: config.network.timeout,
}));


export default class TransactionTracker {
  
  constructor(web3){
    if(web3){
      this.web3 = web3;
    } else {
      this.web3 = httpWeb3;
    }
  }

  async listenTransactionReceipt(txHash){
    console.log(`Listen for ${txHash}`);
    return new Promise((resolve,reject) => {
      const intervalId = setInterval(async () => { 
        //Check status of transaction
        const receipt = await this.web3.eth.getTransactionReceipt(txHash);
        if(receipt){ 
          const success = receipt.status;
          if(success){
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            resolve(receipt);
          } else {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            reject(`Transaction failed`); //TODO: send cause
          }
        }
      },TRANSACTION_CHECK_INTERVAL_MS)
    
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        reject(`Timeout`); //indicate that timeout has been reached
      },TRANSACTION_TIMEOUT_MS);
  
  
    });
  }

}



