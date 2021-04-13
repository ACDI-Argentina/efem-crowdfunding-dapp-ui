import getNetwork from './getNetwork'
import getWeb3 from './getWeb3'
import BigNumber from 'bignumber.js'
import { Observable } from 'rxjs'
import transactionUtils from '../../redux/utils/transactionUtils'

/**
 * API encargada de la interacción con ERC20 Smart Contracts.
 * 
 * https://forum.openzeppelin.com/t/making-sure-i-understand-how-safeerc20-works/2940/5
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
            return new BigNumber(0);
        }
    }

    approve(contractAddress, spenderAddress, amount, senderAddress) {

        console.log('Approve ERC20 Token.', contractAddress, spenderAddress, amount, senderAddress);
            
        return new Observable(async subscriber => {
            
            const erc20Contract = await this.getERC20Contract(contractAddress);

            const method = erc20Contract.methods.approve(
                spenderAddress,
                amount);

            const gasEstimated = await method.estimateGas({
                from: senderAddress
            });

            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleApproveTokenDonate'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleApproveTokenDonate'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleApproveTokenDonate'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleApproveTokenDonate'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionApproveTokenDonate'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleApproveTokenDonate'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionApproveTokenDonate'
                }
            });

            method.send({from: senderAddress})
                .once('transactionHash', (hash) => { // La transacción ha sido creada.
                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);
                })
                .once('confirmation', (confNumber, receipt) => {
                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);
                    subscriber.next(true);
                })
                .on('error', function (error) {
                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);
                    subscriber.next(false);
                });
        });
    }

    async getERC20Contract(address) {
        const web3 = await getWeb3();
        const network = await getNetwork();
        return new web3.eth.Contract(network.ERC20Abi, address);
    }

    async getGasPrice() {
        const web3 = await getWeb3();
        const gasPrice = await web3.eth.getGasPrice();
        return new BigNumber(gasPrice);
    }
}

export default new ERC20ContractApi();