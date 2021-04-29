import { CrowdfundingAbi, ExchangeRateProviderAbi, ERC20Abi } from '@acdi/give4forests-crowdfunding-contract';
import getWeb3 from './getWeb3';
import config from '../../configuration';

let web3Promise;
let network;

const getNetwork = async () => {
  if (network) {
    return network;
  } else if (!web3Promise) {
    console.log(`%c[${new Date().toISOString()}] get Network -`, "color:tomato"); 
    web3Promise = getWeb3();
  }
  const web3 = await web3Promise;

  let newNetwork = Object.assign({}, config);
  newNetwork.crowdfunding = new web3.eth.Contract(CrowdfundingAbi, newNetwork.crowdfundingAddress);
  newNetwork.exchangeRateProvider = new web3.eth.Contract(ExchangeRateProviderAbi, newNetwork.exchangeRateProviderAddress);
  newNetwork.ERC20Abi = ERC20Abi;

  network = newNetwork;
  return network;
};

export default getNetwork;