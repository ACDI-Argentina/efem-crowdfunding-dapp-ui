import DAC from '../../models/DAC';
import Campaign from '../../models/Campaign';
import Milestone from '../../models/Milestone';
import Activity from '../../models/Activity';
import Donation from '../../models/Donation';
import { Observable } from 'rxjs'
import BigNumber from 'bignumber.js';
import transactionUtils from '../../redux/utils/transactionUtils'
import entityUtils from '../../redux/utils/entityUtils'
import dacIpfsConnector from '../../ipfs/DacIpfsConnector'
import campaignIpfsConnector from '../../ipfs/CampaignIpfsConnector'
import milestoneIpfsConnector from '../../ipfs/MilestoneIpfsConnector'
import activityIpfsConnector from '../../ipfs/ActivityIpfsConnector'
import ExchangeRate from '../../models/ExchangeRate';
import config from '../../configuration';
import erc20ContractApi from './ERC20ContractApi';
import { web3Manager, web3Utils } from 'commons';
import { CrowdfundingAbi, ExchangeRateProviderAbi } from '@acdi/give4forests-crowdfunding-contract';
import CrowdfundingUtils from './CrowdfundingUtils';
import TransactionTracker from './TransactionTracker';

/**
 * API encargada de la interacción con el Crowdfunding Smart Contract.
 */
class CrowdfundingContractApi {

    constructor() {
        this.crowdfunding = undefined;
        this.networkPromise = undefined;
        web3Manager.getWeb3().subscribe(web3 => {
            this.web3 = web3;
            this.updateContracts();
            this.crowdfundingUtils = new CrowdfundingUtils(web3,config.crowdfundingAddress);
        });
        this.transactionTracker = new TransactionTracker();
    }

    async canPerformRole(address, role) {
        try {
            const hashedRole = web3Utils.toKeccak256(role);
            const response = await this.crowdfunding.methods.canPerform(address, hashedRole, []).call();
            return response;
        } catch (err) {
            if(!this.crowdfunding){ //TODO: Add common error handling to this class
                console.log(`Crowdfundign smart contract is not initialized`)
            }
            console.log("Fail to invoke canPerform on smart contract.", err);
            return false;
        }
    }

    /**
     * Almacena una DAC en el smart contract
     * 
     * @param dac
     */
    saveDAC(dac) {
        return new Observable(async subscriber => {
            let thisApi = this;

            const dacId = dac.id || 0; //zero is for new dacs;
            const isNew = dacId === 0;

            // Se almacena en IPFS toda la información de la Dac.
            let infoCid = await dacIpfsConnector.upload(dac);

            const clientId = dac.clientId;

            console.log('Guardando', dacId, dac, infoCid);

            const method = this.crowdfunding.methods.saveDac(infoCid, dacId);

            const gasEstimated = await method.estimateGas({
                from: dac.delegateAddress
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: isNew ? 'transactionCreatedTitleCreateDac' : 'transactionCreatedTitleUpdateDac',
                    args: {
                        dacTitle: dac.title
                    }
                },
                createdSubtitle: {
                    key: isNew ? 'transactionCreatedSubtitleCreateDac' : 'transactionCreatedSubtitleUpdateDac',
                },
                pendingTitle: {
                    key: isNew ? 'transactionPendingTitleCreateDac' : 'transactionPendingTitleUpdateDac',
                    args: {
                        dacTitle: dac.title
                    }
                },
                confirmedTitle: {
                    key: isNew ? 'transactionConfirmedTitleCreateDac' : 'transactionConfirmedTitleUpdateDac',
                    args: {
                        dacTitle: dac.title
                    }
                },
                confirmedDescription: {
                    key: isNew ? 'transactionConfirmedDescriptionCreateDac' : 'transactionConfirmedDescriptionUpdateDac'
                },
                failuredTitle: {
                    key: isNew ? 'transactionFailuredTitleCreateDac' : 'transactionFailuredTitleUpdateDac',
                    args: {
                        dacTitle: dac.title
                    }
                },
                failuredDescription: {
                    key: isNew ? 'transactionFailuredDescriptionCreateDac' : 'transactionFailuredDescriptionUpdateDac'
                }
            });

            const promiEvent = method.send({
                from: dac.delegateAddress
            });

            promiEvent
                .once('transactionHash', (hash) => { // La transacción ha sido creada.

                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);

                    dac.txHash = hash;
                    subscriber.next(dac);
                })
                .once('confirmation', (confNumber, receipt) => {

                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);

                    // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                    // TODO Aquí debería gregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                    const idFromEvent = parseInt(receipt.events['SaveDac'].returnValues.id);

                    thisApi.getDacById(idFromEvent).then(dac => {
                        dac.clientId = clientId;
                        subscriber.next(dac);
                    });
                })
                .on('error', function (error) {

                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);

                    error.dac = dac;
                    console.error(`Error procesando transacción de almacenamiento de dac.`, error);
                    subscriber.error(error);
                });
        });
    };

    /**
     * Obtiene la Dac a partir del ID especificado.
     * 
     * @param {*} pid de la Dac a obtener.
     * @returns Dac cuyo Id coincide con el especificado.
     */
    async getDacById(dacId) {
        const { id, 
            infoCid, 
            donationIds, 
            campaignIds, 
            budgetDonationIds, 
            users, 
            status } = await this.crowdfunding.methods.getDac(dacId).call();
        // Se obtiene la información de la Dac desde IPFS.
        const dacOnIpfs = await dacIpfsConnector.download(infoCid);
        const { title, description, imageCid, url } = dacOnIpfs;
        return new DAC({
            id: parseInt(id),
            title,
            description,
            imageCid,
            url,
            campaignIds: campaignIds.map(e => parseInt(e)),
            donationIds: donationIds.map(e => parseInt(e)),
            budgetDonationIds: budgetDonationIds.map(e => parseInt(e)),
            status: this.mapDACStatus(parseInt(status)),
            delegateAddress: users[0],
            commitTime: 0
        });
    }

    /**
     * Obtiene todas las Dacs desde el Smart Contract.
     */
    getDacs() {
        return new Observable(async subscriber => {
            try {
                const ids = await this.crowdfunding.methods.getDacIds().call();
                const dacs = [];
                if (ids.length > 0) {
                    for (let i = 0; i < ids.length; i++) {
                        const dac = await this.getDacById(ids[i]);
                        dacs.push(dac);
                    }
                    subscriber.next(dacs);
                } else {
                    subscriber.next([]);
                }
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene la Dac desde el Smart Contract.
     */
    getDac(id) {
        return new Observable(async subscriber => {
            try {
                const dac = await this.getDacById(id);
                subscriber.next(dac);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene todas las Campaigns desde el Smart Contract.
     */
    getCampaigns() {
        return new Observable(async subscriber => {
            try {
                let ids = await this.crowdfunding.methods.getCampaignIds().call();
                let campaigns = [];
                for (let i = 0; i < ids.length; i++) {
                    let campaign = await this.getCampaignById(ids[i]);
                    campaigns.push(campaign);
                }
                subscriber.next(campaigns);
            } catch (error) {
                console.log('Error obtiendo Campaigns', error);
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene la Campaign desde el Smart Contract.
     */
    getCampaign(id) {
        return new Observable(async subscriber => {
            try {
                let campaign = await this.getCampaignById(id);
                subscriber.next(campaign);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene la Campaign a partir del ID especificado.
     * 
     * @param campaignId de la Campaign a obtener.
     * @returns Campaign cuyo Id coincide con el especificado.
     */
    async getCampaignById(campaignId) {
        const campaingOnChain = await this.crowdfunding.methods.getCampaign(campaignId).call();
        // Se obtiene la información de la Campaign desde IPFS.
        const { id, infoCid, dacIds, milestoneIds, donationIds, budgetDonationIds, users, status } = campaingOnChain;
        // Se obtiene la información de la Campaign desde IPFS.
        const campaignOnIpfs = await campaignIpfsConnector.download(infoCid);
        const { title, description, imageCid, beneficiaries, categories, url } = campaignOnIpfs;

        return new Campaign({
            id: parseInt(id),
            title: title,
            description: description,
            imageCid: imageCid,
            url: url,
            dacIds: dacIds.map(e => parseInt(e)),
            milestoneIds: milestoneIds.map(e => parseInt(e)),
            donationIds: donationIds.map(e => parseInt(e)),
            budgetDonationIds: budgetDonationIds.map(e => parseInt(e)),
            managerAddress: users[0],
            reviewerAddress: users[1],
            beneficiaries: beneficiaries,
            categories: categories,
            status: this.mapCampaignStatus(parseInt(status))
        });
    }

    /**
     * Almacena una Campaing en el Smart Contarct.
     * 
     * @param campaign a almacenar.
     */
    saveCampaign(campaign) {

        return new Observable(async subscriber => {

            let thisApi = this;

            const dacId = 1; //preguntar a Mauri que vamos a hacer con esto, esto existe?
            const campaignId = campaign.id || 0; //zero is for new campaigns;
            const isNew = campaignId === 0;

            // Se almacena en IPFS toda la información de la Campaign.
            let infoCid = await campaignIpfsConnector.upload(campaign);
            campaign.infoCid = infoCid;

            const clientId = campaign.clientId;

            const method = this.crowdfunding.methods.saveCampaign(
                campaign.infoCid,
                dacId,
                campaign.reviewerAddress,
                campaignId);

            const gasEstimated = await method.estimateGas({
                from: campaign.managerAddress,
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: isNew ? 'transactionCreatedTitleCreateCampaign' : 'transactionCreatedTitleUpdateCampaign',
                    args: {
                        campaignTitle: campaign.title
                    }
                },
                createdSubtitle: {
                    key: isNew ? 'transactionCreatedSubtitleCreateCampaign' : 'transactionCreatedSubtitleUpdateCampaign'
                },
                pendingTitle: {
                    key: isNew ? 'transactionPendingTitleCreateCampaign' : 'transactionPendingTitleUpdateCampaign',
                    args: {
                        campaignTitle: campaign.title
                    }
                },
                confirmedTitle: {
                    key: isNew ? 'transactionConfirmedTitleCreateCampaign' : 'transactionConfirmedTitleUpdateCampaign',
                    args: {
                        campaignTitle: campaign.title
                    }
                },
                confirmedDescription: {
                    key: isNew ? 'transactionConfirmedDescriptionCreateCampaign' : 'transactionConfirmedDescriptionUpdateCampaign'
                },
                failuredTitle: {
                    key: isNew ? 'transactionFailuredTitleCreateCampaign' : 'transactionFailuredTitleUpdateCampaign',
                    args: {
                        campaignTitle: campaign.title
                    }
                },
                failuredDescription: {
                    key: isNew ? 'transactionFailuredDescriptionCreateCampaign' : 'transactionFailuredDescriptionUpdateCampaign'
                }
            });

            const promiEvent = method.send({
                from: campaign.managerAddress,
            });

            promiEvent
                .once('transactionHash', (hash) => { // La transacción ha sido creada.

                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);

                    campaign.txHash = hash;
                    subscriber.next(campaign);
                })
                .once('confirmation', (confNumber, receipt) => {

                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);

                    // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                    // TODO Aquí debería gregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                    const idFromEvent = parseInt(receipt.events['SaveCampaign'].returnValues.id);

                    thisApi.getCampaignById(idFromEvent).then(campaign => {
                        campaign.clientId = clientId;
                        subscriber.next(campaign);
                    });
                })
                .on('error', function (error) {

                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);

                    error.campaign = campaign;
                    console.error(`Error procesando transacción de almacenamiento de campaign.`, error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Obtiene todos los Milestones desde el Smart Contract.
     */
    getMilestones() {
        return new Observable(async subscriber => {
            try {
                let ids = await this.crowdfunding.methods.getMilestoneIds().call();
                let milestones = [];
                for (let i = 0; i < ids.length; i++) {
                    let milestone = await this.getMilestoneById(ids[i]);
                    milestones.push(milestone);
                }
                subscriber.next(milestones);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene el Milestone desde el Smart Contract.
     */
    getMilestone(id) {
        return new Observable(async subscriber => {
            try {
                let milestone = await this.getMilestoneById(id);
                subscriber.next(milestone);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene el Milestone a partir del ID especificado.
     * 
     * @param id del Milestone a obtener.
     * @returns Milestone cuyo Id coincide con el especificado.
     */
    async getMilestoneById(milestoneId) {
        const milestoneOnChain = await this.crowdfunding.methods.getMilestone(milestoneId).call();
        const { id, campaignId, infoCid, fiatAmountTarget, users, activityIds, donationIds, budgetDonationIds, status } = milestoneOnChain;
        // Se obtiene la información del Milestone desde IPFS.
        const milestoneOnIpfs = await milestoneIpfsConnector.download(infoCid);
        const { title, description, imageCid, url } = milestoneOnIpfs;

        return new Milestone({
            id: parseInt(id),
            campaignId: parseInt(campaignId),
            title: title,
            description: description,
            imageCid: imageCid,
            url: url,
            fiatAmountTarget: new BigNumber(fiatAmountTarget),
            activityIds: activityIds.map(e => parseInt(e)),
            donationIds: donationIds.map(e => parseInt(e)),
            budgetDonationIds: budgetDonationIds.map(e => parseInt(e)),
            managerAddress: users[0],
            reviewerAddress: users[1],
            campaignReviewerAddress: users[2],
            recipientAddress: users[3],
            status: this.mapMilestoneStatus(parseInt(status))
        });
    }

    /**
     * Almacena un Milestone en el Smart Contarct.
     * 
     * @param milestone a almacenar.
     */
    saveMilestone(milestone) {

        return new Observable(async subscriber => {

            let thisApi = this;

            const milestoneId = milestone.id || 0; //zero is for new milestone;
            const isNew = milestoneId === 0;

            // Se almacena en IPFS toda la información del Milestone.
            let infoCid = await milestoneIpfsConnector.upload(milestone);

            let clientId = milestone.clientId;

            const method = this.crowdfunding.methods.saveMilestone(
                infoCid,
                milestone.campaignId,
                milestone.fiatAmountTarget,
                milestone.managerAddress, //Por ahora el milestone manager es el campaign manager, pero podemos pasarle cualquier address con el rol CREATE_MILESTONE_ROLE
                milestone.reviewerAddress,
                milestone.recipientAddress,
                milestone.campaignReviewerAddress,
                milestoneId
            );

            const gasEstimated = await method.estimateGas({
                from: milestone.managerAddress
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: isNew ? 'transactionCreatedTitleCreateMilestone' : 'transactionCreatedTitleUpdateMilestone',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                createdSubtitle: {
                    key: isNew ? 'transactionCreatedSubtitleCreateMilestone' : 'transactionCreatedSubtitleUpdateMilestone',
                },
                pendingTitle: {
                    key: isNew ? 'transactionPendingTitleCreateMilestone' : 'transactionPendingTitleUpdateMilestone',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedTitle: {
                    key: isNew ? 'transactionConfirmedTitleCreateMilestone' : 'transactionConfirmedTitleUpdateMilestone',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedDescription: {
                    key: isNew ? 'transactionConfirmedDescriptionCreateMilestone' : 'transactionConfirmedDescriptionUpdateMilestone',
                },
                failuredTitle: {
                    key: isNew ? 'transactionFailuredTitleCreateMilestone' : 'transactionFailuredTitleUpdateMilestone',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                failuredDescription: {
                    key: isNew ? 'transactionFailuredDescriptionCreateMilestone' : 'transactionFailuredDescriptionUpdateMilestone',
                }
            });

            const promiEvent = method.send({
                from: milestone.managerAddress
            });

            promiEvent
                .once('transactionHash', (hash) => { // La transacción ha sido creada.

                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);

                    milestone.txHash = hash;
                    subscriber.next(milestone);
                })
                .once('confirmation', (confNumber, receipt) => {

                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);

                    // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                    // TODO Aquí debería gregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                    const idFromEvent = parseInt(receipt.events['SaveMilestone'].returnValues.id);

                    thisApi.getMilestoneById(idFromEvent).then(milestone => {
                        milestone.clientId = clientId;
                        subscriber.next(milestone);
                    });
                })
                .on('error', function (error) {

                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);

                    error.milestone = milestone;
                    console.error(`Error procesando transacción de almacenamiento de milestone.`, error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Obtiene todas las Donaciones desde el Smart Contract.
     */
    getDonations() {
        return new Observable(async subscriber => {
            try {
                let ids = await this.crowdfunding.methods.getDonationIds().call();
                let donations = [];
                for (let i = 0; i < ids.length; i++) {
                    let donation = await this.getDonationById(ids[i]);
                    donations.push(donation);
                }
                subscriber.next(donations);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene todas las Donaciones desde el Smart Contract que coinciden con los
     * IDs especificados.
     * 
     * @param ids IDs de las donaciones a obtener.
     */
    getDonationsByIds(ids) {
        return new Observable(async subscriber => {
            try {
                let donations = [];
                for (let i = 0; i < ids.length; i++) {
                    let donation = await this.getDonationById(ids[i]);
                    donations.push(donation);
                }
                subscriber.next(donations);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene la Donación a partir del ID especificado.
     * 
     * @param donationId de la Donación a obtener.
     * @returns Donación cuyo Id coincide con el especificado.
     */
    async getDonationById(donationId) {
        const donationOnChain = await this.crowdfunding.methods.getDonation(donationId).call();
        // Se obtiene la información de la Donación desde IPFS.
        const { id,
            giver,
            token,
            amount,
            amountRemainding,
            createdAt,
            entityId,
            budgetEntityId,
            status } = donationOnChain;

        return new Donation({
            id: parseInt(id),
            giverAddress: giver,
            tokenAddress: token,
            amount: new BigNumber(amount),
            amountRemainding: new BigNumber(amountRemainding),
            createdAt: createdAt,
            entityId: parseInt(entityId),
            budgetEntityId: parseInt(budgetEntityId),
            status: this.mapDonationStatus(parseInt(status))
        });
    }

    /**
     * Almacena una Donacón en el Smart Contarct.
     * 
     * @param donation a almacenar.
     */
    saveDonation(donation) {
        if (web3Utils.addressEquals(donation.tokenAddress, config.tokens.rbtc.address)) {
            // Donación en token nativo
            return this.saveDonationNative(donation);
        } else {
            // Donación en ERC20 token
            return this.saveDonationToken(donation);
        }
    }

    /**
     * Almacena una Donación Nativa en el Smart Contarct.
     * 
     * @param donation a almacenar.
     */
    saveDonationNative(donation) {

        return new Observable(async subscriber => {
            console.log("save donation - observable");
            let thisApi = this;

            let clientId = donation.clientId;

            const method = this.crowdfunding.methods.donate(
                donation.entityId,
                donation.tokenAddress,
                donation.amount);

            const gasEstimated = await method.estimateGas({
                from: donation.giverAddress,
                value: donation.amount
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleDonate'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleDonate'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleDonate'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleDonate'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionDonate'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleDonate'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionDonate'
                }
            });

            const promiEvent = method.send({
                from: donation.giverAddress,
                value: donation.amount
            });


            const onTransactionHash = async (hash) => { // La transacción ha sido creada.
                transaction.submit(hash);
                transactionUtils.updateTransaction(transaction);
                
                donation.txHash = hash;
                subscriber.next(donation);

                if(this.web3.providerName == "WalletConnect"){
                    try {
                        const receipt = await this.transactionTracker.listenTransactionReceipt(hash);
                        if (receipt.status) { //Transaction was confirmed
                            onConfirmation(undefined,receipt);
                        } else {//Transaction was reverted
                            onError(new Error(`Transaction reverted`));
                        }

                    }  catch(err){
                        console.log(err);
                        onError(new Error(`Transaction reverted`));
                    }
                }
            }

            const onConfirmation = async (confNumber, receipt) => {
                transaction.confirme();
                transactionUtils.updateTransaction(transaction);

                let idFromEvent;

                if(this.web3?.providerName == "WalletConnect"){
                    const { donationId } = this.crowdfundingUtils.getEventData(receipt,`NewDonation`);
                    idFromEvent = donationId;
                } else {
                    // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                    // TODO Aquí debería gregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                    idFromEvent = parseInt(receipt.events['NewDonation'].returnValues.id);
                }
                
                const donation = await thisApi.getDonationById(idFromEvent);
                donation.clientId = clientId;
                subscriber.next(donation);
                
                entityUtils.refreshEntity(donation.entityId);
            };

            const onError = function (error) {

                transaction.fail();
                transactionUtils.updateTransaction(transaction);

                error.donation = donation;
                console.error(`Error procesando transacción de almacenamiento de donación.`, error);
                subscriber.error(error);
            };

            promiEvent
                .once('transactionHash', onTransactionHash)
                .once('confirmation', onConfirmation)
                .on('error',onError);
        });
    }

    /**
     * Almacena una Donacón de ERC20 Token en el Smart Contarct.
     * 
     * La donación con ERC20 Token requiere de la aprobación previa para que
     * el smart contract de Crowdfunding pueda transferir los fondos al vault
     * en nombre del donante. 
     * 
     * @param donation a almacenar.
     */
    saveDonationToken(donation) {

        let thisApi = this;

        return new Observable(async subscriber => {

            erc20ContractApi.approve(
                donation.tokenAddress,
                config.crowdfundingAddress,
                donation.amount,
                donation.giverAddress).subscribe(async approved => {

                    if (approved) {

                        // Se aprobó la transferencia de fondos desde el token.

                        let clientId = donation.clientId;

                        const method = this.crowdfunding.methods.donate(
                            donation.entityId,
                            donation.tokenAddress,
                            donation.amount);

                        const gasEstimated = await method.estimateGas({
                            from: donation.giverAddress
                        });
                        const gasPrice = await this.getGasPrice();

                        let transaction = transactionUtils.addTransaction({
                            gasEstimated: new BigNumber(gasEstimated),
                            gasPrice: gasPrice,
                            createdTitle: {
                                key: 'transactionCreatedTitleDonate'
                            },
                            createdSubtitle: {
                                key: 'transactionCreatedSubtitleDonate'
                            },
                            pendingTitle: {
                                key: 'transactionPendingTitleDonate'
                            },
                            confirmedTitle: {
                                key: 'transactionConfirmedTitleDonate'
                            },
                            confirmedDescription: {
                                key: 'transactionConfirmedDescriptionDonate'
                            },
                            failuredTitle: {
                                key: 'transactionFailuredTitleDonate'
                            },
                            failuredDescription: {
                                key: 'transactionFailuredDescriptionDonate'
                            }
                        });

                        const promiEvent = method.send({
                            from: donation.giverAddress
                        });




                        const onTransactionHash = async (hash) => { // La transacción ha sido creada.
                            transaction.submit(hash);
                            transactionUtils.updateTransaction(transaction);

                            donation.txHash = hash;
                            subscriber.next(donation);

                            if (this.web3.providerName == "WalletConnect") {
                                try {
                                    const receipt = await this.transactionTracker.listenTransactionReceipt(hash);
                                
                                    if (receipt.status) { //Transaction was confirmed
                                        onConfirmation(undefined,receipt);
                                    } else {//Transaction was reverted
                                        onError(new Error(`Transaction reverted`));
                                    }
                                } catch (err) {
                                    onError(new Error(`Transaction reverted`));
                                }
                            }
                        };

                        const onConfirmation = (confNumber, receipt) => {

                            transaction.confirme();
                            transactionUtils.updateTransaction(transaction);

                            let idFromEvent;

                            if(this.web3?.providerName == "WalletConnect"){
                                const { donationId } = this.crowdfundingUtils.getEventData(receipt,`NewDonation`);
                                idFromEvent = donationId;
                            } else {
                                // La transacción ha sido incluida en un bloque sin bloques de confirmación (once).                        
                                // TODO Aquí debería gregarse lógica para esperar un número determinado de bloques confirmados (on, confNumber).
                                idFromEvent = parseInt(receipt.events['NewDonation'].returnValues.id);
                            }
                            
                            thisApi.getDonationById(idFromEvent).then(donation => {
                                donation.clientId = clientId;
                                subscriber.next(donation);
                            });
                            entityUtils.refreshEntity(donation.entityId);
                        }

                        const onError =  function (error) {

                            transaction.fail();
                            transactionUtils.updateTransaction(transaction);

                            error.donation = donation;
                            console.error(`Error procesando transacción de almacenamiento de donación.`, error);
                            subscriber.error(error);
                        }

                        promiEvent
                            .once('transactionHash',onTransactionHash)
                            .once('confirmation',onConfirmation)
                            .on('error',onError);

                    } else {
                        // No se aprobó la transferencia de fondos desde el token.
                        subscriber.error('No se aprobó la transferencia de fondos desde el token.');
                    }
                });
        });
    }

    /**
     * Transfiere las donaciones en el Smart Contarct.
     * 
     * @param userAddress Dirección del usuario que realiza la transferencia.
     * @param entityIdFrom ID de la entidad desde donde se transfieren las donaciones.
     * @param entityIdTo ID de la entidad hacia donde se transfieren las donaciones.
     * @param donationIds IDs de las donaciones a transferir.
     */
    transferDonations(userAddress, entityIdFrom, entityIdTo, donationIds) {

        return new Observable(async subscriber => {

            const method = this.crowdfunding.methods.transfer(
                entityIdFrom,
                entityIdTo,
                donationIds);

            const gasEstimated = await method.estimateGas({
                from: userAddress
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleTransfer'
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleTransfer'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleTransfer'
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleTransfer'
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionTransfer'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleTransfer'
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionTransfer'
                }
            });

            const promiEvent = method.send({
                from: userAddress
            });

            promiEvent
                .once('transactionHash', (hash) => { // La transacción ha sido creada.

                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);
                })
                .once('confirmation', (confNumber, receipt) => {

                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);

                    subscriber.next(donationIds);

                    entityUtils.refreshEntity(entityIdFrom);
                    entityUtils.refreshEntity(entityIdTo);
                })
                .on('error', function (error) {

                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);

                    console.error(`Error procesando transacción de transferencia de donaciones.`, error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Marca como completado un Milestone en el Smart Contarct.
     * 
     * @param milestone a marcar como completado.
     */
    milestoneComplete(milestone, activity) {

        return new Observable(async subscriber => {

            let thisApi = this;

            // Se almacena en IPFS toda la información del Activity.
            let activityInfoCid = await activityIpfsConnector.upload(activity);

            let clientId = milestone.clientId;

            const method = this.crowdfunding.methods.milestoneComplete(
                milestone.id,
                activityInfoCid);

            const gasEstimated = await method.estimateGas({
                from: activity.userAddress
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleMilestoneComplete',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleMilestoneComplete'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleMilestoneComplete',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleMilestoneComplete',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionMilestoneComplete'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleMilestoneComplete',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionMilestoneComplete'
                }
            });

            const promiEvent = method.send({
                from: activity.userAddress
            });

            promiEvent
                .once('transactionHash', (hash) => { // La transacción ha sido creada.

                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);

                    // La transacción ha sido creada.
                    milestone.txHash = hash;
                    subscriber.next(milestone);
                })
                .once('confirmation', (confNumber, receipt) => {

                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);

                    let milestoneId = parseInt(receipt.events['MilestoneComplete'].returnValues.milestoneId);
                    thisApi.getMilestoneById(milestoneId).then(milestone => {
                        milestone.clientId = clientId;
                        subscriber.next(milestone);
                    });
                })
                .on('error', function (error) {

                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);

                    error.milestone = milestone;
                    console.error(`Error procesando transacción para completar el milestone.`, error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Marca como completado un Milestone en el Smart Contarct.
     * 
     * @param milestone a marcar como completado.
     */
     milestoneCancel(milestone, activity) {

        return new Observable(async subscriber => {

            let thisApi = this;

            // Se almacena en IPFS toda la información del Activity.
            let activityInfoCid = await activityIpfsConnector.upload(activity);

            let clientId = milestone.clientId;

            const method = this.crowdfunding.methods.milestoneCancel(
                milestone.id,
                activityInfoCid);

            const gasEstimated = await method.estimateGas({
                from: activity.userAddress
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleMilestoneCancel',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleMilestoneCancel'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleMilestoneCancel',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleMilestoneCancel',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionMilestoneCancel'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleMilestoneCancel',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionMilestoneCancel'
                }
            });

            const promiEvent = method.send({
                from: activity.userAddress
            });

            promiEvent
                .once('transactionHash', (hash) => { // La transacción ha sido creada.

                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);

                    // La transacción ha sido creada.
                    milestone.txHash = hash;
                    subscriber.next(milestone);
                })
                .once('confirmation', (confNumber, receipt) => {

                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);

                    let milestoneId = parseInt(receipt.events['MilestoneCancel'].returnValues.milestoneId);
                    thisApi.getMilestoneById(milestoneId).then(milestone => {
                        milestone.clientId = clientId;
                        subscriber.next(milestone);
                    });
                })
                .on('error', function (error) {

                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);

                    error.milestone = milestone;
                    console.error(`Error procesando transacción para cancelar el milestone.`, error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Revisa el milestone para marcarlo como aprobado o no en el Smart Contarct.
     * 
     * @param milestone a revisar.
     */
    milestoneReview(milestone, activity) {

        return new Observable(async subscriber => {

            let thisApi = this;

            // Se almacena en IPFS toda la información del Activity.
            let activityInfoCid = await activityIpfsConnector.upload(activity);

            let clientId = milestone.clientId;

            const method = this.crowdfunding.methods.milestoneReview(
                milestone.id,
                activity.isApprove,
                activityInfoCid);

            const gasEstimated = await method.estimateGas({
                from: activity.userAddress
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: activity.isApprove ? 'transactionCreatedTitleMilestoneApprove' : 'transactionCreatedTitleMilestoneReject',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                createdSubtitle: {
                    key: activity.isApprove ? 'transactionCreatedSubtitleMilestoneApprove' : 'transactionCreatedSubtitleMilestoneReject'
                },
                pendingTitle: {
                    key: activity.isApprove ? 'transactionPendingTitleMilestoneApprove' : 'transactionPendingTitleMilestoneReject',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedTitle: {
                    key: activity.isApprove ? 'transactionConfirmedTitleMilestoneApprove' : 'transactionConfirmedTitleMilestoneReject',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedDescription: {
                    key: activity.isApprove ? 'transactionConfirmedDescriptionMilestoneApprove' : 'transactionConfirmedDescriptionMilestoneReject'
                },
                failuredTitle: {
                    key: activity.isApprove ? 'transactionFailuredTitleMilestoneApprove' : 'transactionFailuredTitleMilestoneReject',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                failuredDescription: {
                    key: activity.isApprove ? 'transactionFailuredDescriptionMilestoneApprove' : 'transactionFailuredDescriptionMilestoneReject'
                }
            });

            const promiEvent = method.send({
                from: activity.userAddress
            });

            promiEvent
                .once('transactionHash', (hash) => { // La transacción ha sido creada.

                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);

                    // La transacción ha sido creada.
                    milestone.txHash = hash;
                    subscriber.next(milestone);
                })
                .once('confirmation', (confNumber, receipt) => {

                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);

                    let milestoneId;
                    if (activity.isApprove) {
                        milestoneId = parseInt(receipt.events['MilestoneApprove'].returnValues.milestoneId);
                    } else {
                        milestoneId = parseInt(receipt.events['MilestoneReject'].returnValues.milestoneId);
                    }
                    thisApi.getMilestoneById(milestoneId).then(milestone => {
                        milestone.clientId = clientId;
                        subscriber.next(milestone);
                    });

                })
                .on('error', function (error) {

                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);

                    error.milestone = milestone;
                    console.error(`Error procesando transacción para revisión el milestone.`, error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Retiro de fondos de un milestone.
     * 
     * @param milestone desde el cual se retiran los fondos.
     */
    milestoneWithdraw(milestone) {

        return new Observable(async subscriber => {

            let thisApi = this;

            let clientId = milestone.clientId;

            const method = this.crowdfunding.methods.milestoneWithdraw(milestone.id);

            const gasEstimated = await method.estimateGas({
                from: milestone.recipientAddress
            });
            const gasPrice = await this.getGasPrice();

            let transaction = transactionUtils.addTransaction({
                gasEstimated: new BigNumber(gasEstimated),
                gasPrice: gasPrice,
                createdTitle: {
                    key: 'transactionCreatedTitleMilestoneWithdraw',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                createdSubtitle: {
                    key: 'transactionCreatedSubtitleMilestoneWithdraw'
                },
                pendingTitle: {
                    key: 'transactionPendingTitleMilestoneWithdraw',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedTitle: {
                    key: 'transactionConfirmedTitleMilestoneWithdraw',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                confirmedDescription: {
                    key: 'transactionConfirmedDescriptionMilestoneWithdraw'
                },
                failuredTitle: {
                    key: 'transactionFailuredTitleMilestoneWithdraw',
                    args: {
                        milestoneTitle: milestone.title
                    }
                },
                failuredDescription: {
                    key: 'transactionFailuredDescriptionMilestoneWithdraw'
                }
            });

            const promiEvent = method.send({
                from: milestone.recipientAddress
            });

            promiEvent
                .once('transactionHash', (hash) => { // La transacción ha sido creada.

                    transaction.submit(hash);
                    transactionUtils.updateTransaction(transaction);

                    // La transacción ha sido creada.
                    milestone.txHash = hash;
                    subscriber.next(milestone);
                })
                .once('confirmation', (confNumber, receipt) => {

                    transaction.confirme();
                    transactionUtils.updateTransaction(transaction);


                    let milestoneId = parseInt(receipt.events['MilestoneWithdraw'].returnValues.milestoneId);
                    thisApi.getMilestoneById(milestoneId).then(milestone => {
                        milestone.clientId = clientId;
                        subscriber.next(milestone);
                    });
                })
                .on('error', function (error) {

                    transaction.fail();
                    transactionUtils.updateTransaction(transaction);

                    error.milestone = milestone;
                    console.error(`Error procesando transacción de retiro de fondos de milestone.`, error);
                    subscriber.error(error);
                });
        });
    }

    /**
     * Obtiene todas las Activities desde el Smart Contract que coinciden con los
     * IDs especificados.
     * 
     * @param ids IDs de las activities a obtener.
     */
    getActivitiesByIds(ids) {
        return new Observable(async subscriber => {
            try {
                let activities = [];
                for (let i = 0; i < ids.length; i++) {
                    let activity = await this.getActivityById(ids[i]);
                    activities.push(activity);
                }
                subscriber.next(activities);
            } catch (error) {
                subscriber.error(error);
            }
        });
    }

    /**
     * Obtiene la Activity a partir del ID especificado.
     * 
     * @param activityId de la Activity a obtener.
     * @returns Activity cuyo Id coincide con el especificado.
     */
    async getActivityById(activityId) {
        const activityOnChain = await this.crowdfunding.methods.getActivity(activityId).call();
        console.log('activityOnChain', activityOnChain);
        const { id, infoCid, user, createdAt, milestoneId } = activityOnChain;
        // Se obtiene la información del Activity desde IPFS.
        const activityOnIpfs = await activityIpfsConnector.download(infoCid);
        const { action, message, items } = activityOnIpfs;
        return new Activity({
            id: parseInt(id),
            userAddress: user,
            createdAt: createdAt,
            milestoneId: parseInt(milestoneId),
            action: action,
            message: message,
            items: items
        });
    }

    /**
     * Obtiene todas los tipos de cambios de token.
     */
    getExchangeRates() {
        return new Observable(async subscriber => {
            try {
                const rate = await this.exchangeRateProvider.methods.getExchangeRate(config.nativeToken.address).call();
                console.log('RBTC/USD rate', config.nativeToken.address, rate);
                // TODO Obtener otros Exchage Rates desde el smart contract.
                let exchangeRates = [];

                // RBTC
                let exchangeRate = new ExchangeRate({
                    tokenAddress: config.nativeToken.address,
                    rate: new BigNumber(rate),
                    date: Date.now()
                });

                exchangeRates.push(exchangeRate);
                subscriber.next(exchangeRates);

            } catch (error) {
                console.log(error);
                subscriber.error(error);
            }
        });
    }

    async getExchangeRateByToken(tokenAddress) {
        return await this.exchangeRateProvider.methods.getExchangeRate(tokenAddress).call();
    }

    /**
     * Realiza el mapping de los estados de las dac en el
     * smart contract con los estados en la dapp.
     * 
     * @param status de la dac en el smart contract.
     * @returns estado de la dac en la dapp.
     */
    mapDACStatus(status) {
        switch (status) {
            case 0: return DAC.ACTIVE;
            case 1: return DAC.CANCELLED;
        }
    }

    /**
     * Realiza el mapping de los estados de las campaign en el
     * smart contract con los estados en la dapp.
     * 
     * @param status de la campaign en el smart contract.
     * @returns estado de la campaign en la dapp.
     */
    mapCampaignStatus(status) {
        switch (status) {
            case 0: return Campaign.ACTIVE;
            case 1: return Campaign.CANCELLED;
        }
    }

    /**
     * Realiza el mapping de los estados del milestone en el
     * smart contract con los estados en la dapp.
     * 
     * @param status del milestone en el smart contract.
     * @returns estado del milestone en la dapp.
     */
    mapMilestoneStatus(status) {
        switch (status) {
            case 0: return Milestone.ACTIVE;
            case 1: return Milestone.CANCELLED;
            case 2: return Milestone.COMPLETED;
            case 3: return Milestone.APPROVED;
            case 4: return Milestone.REJECTED;
            case 5: return Milestone.PAID;
        }
    }

    /**
     * Realiza el mapping de los estados de las donación en el
     * smart contract con los estados en la dapp.
     * 
     * @param status de la donación en el smart contract.
     * @returns estado de la donación en la dapp.
     */
    mapDonationStatus(status) {
        switch (status) {
            case 0: return Donation.AVAILABLE;
            case 1: return Donation.SPENT;
            case 2: return Donation.RETURNED;
        }
    }

    async getGasPrice() {
        const gasPrice = await this.web3.eth.getGasPrice();
        return new BigNumber(gasPrice);
    }

    updateContracts() {
        const { crowdfundingAddress, exchangeRateProviderAddress } = config;
        console.log('[Crowdfunding Contract API] Se actualizan contratos.', crowdfundingAddress, exchangeRateProviderAddress);
        this.crowdfunding = new this.web3.eth.Contract(CrowdfundingAbi, crowdfundingAddress);
        this.exchangeRateProvider = new this.web3.eth.Contract(ExchangeRateProviderAbi, exchangeRateProviderAddress);
    }
}

export default new CrowdfundingContractApi();