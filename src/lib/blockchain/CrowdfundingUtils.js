
import Web3 from 'web3';
import Web3HttpProvider from 'web3-providers-http';
import config from '../../configuration';

const TRANSACTION_CHECK_INTERVAL_MS = 1000;
const TRANSACTION_TIMEOUT_MS = 300000; //5 min

//Usamos este provider, ya que al utilizar el de wallet connect no obtenermos resultados consistentes
const httpWeb3 = new Web3(new Web3HttpProvider(
  config.network.nodeUrl, {
  keepAlive: true,
  timeout: config.network.timeout,
}));

const params = {
  "NewDonation" : ['uint256', 'uint256', 'address', 'uint256'],
};
const signatures = {
  "NewDonation": "NewDonation(uint256,uint256,address,uint256)",
}

//

class CrowdfundingUtils {
  constructor(web3,crowdfundingAddress) {
    this.web3 = web3;
    this.crowdfundingAddress = crowdfundingAddress;
  }

  isEventOfType(topic,type){
    return topic === this.web3.utils.keccak256(signatures[type]);
  }

  getEventData(receipt, eventType) {
    const log = (receipt.logs.filter(l => l.address === this.crowdfundingAddress))[0];
    if (this.isEventOfType(log.topics[0],eventType)) {
      const eventData = this.web3.eth.abi.decodeParameters(params[`${eventType}`], log.data);
      const [donationId, entityId, tokenAddress, amount] = Object.values(eventData);
      return {
        donationId,
        entityId,
        tokenAddress,
        amount
      }
    }
  }


  //TODO: Este metodo es general a cualquier transaccion, no solo las relacionadas
  //con el smart contract de crowdfuding moverlo a una clase dedicada
  async listenTransactionReceipt(txHash){
    console.log(`Listen for ${txHash}`);
    return new Promise((resolve,reject) => {
      const intervalId = setInterval(async () => { 
        //Check status of transaction
        const receipt = await httpWeb3.eth.getTransactionReceipt(txHash);
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

export default CrowdfundingUtils;