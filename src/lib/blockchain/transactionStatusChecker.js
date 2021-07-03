import Web3 from 'web3';
import Web3HttpProvider from 'web3-providers-http';
import config from '../../configuration';
//Usamos este provider, ya que al utilizar el de
// wallet connect no obtenermos resultados consistentes
const provider = new Web3HttpProvider(config.network.nodeUrl, {
  keepAlive: true,
  timeout: config.network.timeout,
});
const web3 = new Web3(provider);

const transactionTimeout = 300000; //5 min

export const listen = async (txHash) => {
  console.log(`Listen for ${txHash}`);
  return new Promise((resolve,reject) => {
    const intervalId = setInterval(async () => { 
      //Check status of transaction
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if(receipt){ 
        const success = receipt.status;
        if(success){
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          
          resolve(receipt);
        } else {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          reject(`Transaction failed`); //why???
        }
      }
    },1000)
  
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      reject(`Timeout`); //indicate that timeout has been reached
    },transactionTimeout);


  });

  





}