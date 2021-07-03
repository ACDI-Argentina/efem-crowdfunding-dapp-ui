import BigNumber from 'bignumber.js'
import { Observable } from 'rxjs'
import transactionUtils from '../../redux/utils/transactionUtils'
import web3Manager from './Web3Manager';
import { ERC20Abi } from '@acdi/give4forests-crowdfunding-contract';
import { listen } from './transactionStatusChecker';

/**
 * API encargada de la interacción con ERC20 Smart Contracts.
 * 
 * https://forum.openzeppelin.com/t/making-sure-i-understand-how-safeerc20-works/2940/5
 */
class ERC20ContractApi {

    constructor() {
        web3Manager.getWeb3().subscribe(web3 => {
            this.web3 = web3;
        });
    }

    async getBalance(contractAddress, ownerAddress) {
        try {
            const erc20Contract = await this.getERC20Contract(contractAddress);
            const balance = await erc20Contract.methods.balanceOf(ownerAddress).call();
            return new BigNumber(balance);
        } catch (err) {
            console.error("Error obteniendo balance de ERC20 Token.",contractAddress, err);
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
                .once('transactionHash', async (hash) => { // La transacción ha sido creada.
                    
                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);

                    try {
                        const receipt = await listen(hash);
                        //Only for wallet connect!
                        if (receipt) {
                            transaction.confirme();
                            transactionUtils.updateTransaction(transaction);
                            subscriber.next(true);
                        }
                    }  catch(err){
                        console.log(err);
                        //Call error handlng
                    }

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
        return new this.web3.eth.Contract(ERC20Abi, address);
    }

    async getGasPrice() {
        const gasPrice = await this.web3.eth.getGasPrice();
        return new BigNumber(gasPrice);
    }
}

export default new ERC20ContractApi();