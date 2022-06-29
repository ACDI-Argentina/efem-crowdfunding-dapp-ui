import {
    Web3Utils,
    Web3Manager,
    AccountManager,
    TransactionsManager,
    ERC20ContractApi,
    AdminContractApi,
    FeathersClient,
    FeathersUserClient,
    UserService,
    AuthService,
    UserIpfsConnector
} from '@acdi/efem-dapp';

import config from 'configuration';

const commonsContext = {
    config: config
}

export const web3Utils = new Web3Utils(commonsContext);
commonsContext.web3Utils = web3Utils;

export const feathersClient = new FeathersClient(commonsContext);
commonsContext.feathersClient = feathersClient;

export const feathersUserClient = new FeathersUserClient(commonsContext);
commonsContext.feathersUserClient = feathersUserClient;

export const web3Manager = new Web3Manager(commonsContext);
commonsContext.web3Manager = web3Manager;

export const transactionsManager = new TransactionsManager();
commonsContext.transactionsManager = transactionsManager;

export const erc20ContractApi = new ERC20ContractApi(commonsContext);
commonsContext.erc20ContractApi = erc20ContractApi;

export const adminContractApi = new AdminContractApi(commonsContext);
commonsContext.adminContractApi = adminContractApi;

export const accountManager = new AccountManager(commonsContext);
commonsContext.accountManager = accountManager;

export const userIpfsConnector = new UserIpfsConnector(commonsContext);
commonsContext.userIpfsConnector = userIpfsConnector;

export const userService = new UserService(commonsContext);
commonsContext.userService = userService;

export const authService = new AuthService(commonsContext);
commonsContext.authService = authService;

export default commonsContext;