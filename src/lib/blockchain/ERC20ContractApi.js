import getNetwork from './getNetwork';
import web3 from 'web3';
import BigNumber from 'bignumber.js';

/**
 * API encargada de la interacción con ERC20 Smart Contracts.
 */
class ERC20ContractApi {

    constructor() { }

    async getBalance(contractAddress, ownerAddress) {
        try {
            const erc20Contract = await this.getERC20Contract(contractAddress);
            const balance = await erc20Contract.methods.balanceOf(ownerAddress).call();
            return new BigNumber(balance);
        } catch (err) {
            console.error("Error obteniendo balance de ERC20 Token.", err);
            return 0;
        }
    }    

    async getERC20Contract(address) {
        const network = await getNetwork();
        return new web3.eth.Contract(network.ERC20Abi, address);
    }
}

export default new ERC20ContractApi();