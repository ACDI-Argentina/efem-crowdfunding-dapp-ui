import { CrowdfundingAbi, ExchangeRateProviderAbi, ERC20Abi } from '@acdi/give4forests-crowdfunding-contract';
import getWeb3 from './getWeb3';
import config from '../../configuration';

let network;

export default async () => {

  if (!network) {

    const web3 = await getWeb3();

    let newNetwork = Object.assign({}, config);

    newNetwork.crowdfunding = new web3.eth.Contract(CrowdfundingAbi, newNetwork.crowdfundingAddress);
    newNetwork.exchangeRateProvider = new web3.eth.Contract(ExchangeRateProviderAbi, newNetwork.exchangeRateProviderAddress);
    newNetwork.ERC20Abi = ERC20Abi;

    network = newNetwork;
  }

  return network;
};
