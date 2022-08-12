import {
    Web3Utils,
    Web3Manager,
    NetworkManager,
    AccountManager,
    TransactionManager,
    MessageManager,
    ERC20ContractApi,
    AdminContractApi,
    FeathersUsersClient,
    UserService,
    AuthService,
    IpfsService,
    UserIpfsConnector,
    ValidatorUtils
} from '@acdi/efem-dapp';
import config from 'configuration';

const commonsContext = {
    config: config
}

export const validatorUtils = new ValidatorUtils();
commonsContext.validatorUtils = validatorUtils;

export const web3Utils = new Web3Utils(commonsContext);
commonsContext.web3Utils = web3Utils;

export const feathersUsersClient = new FeathersUsersClient(commonsContext);
commonsContext.feathersUsersClient = feathersUsersClient;

export const web3Manager = new Web3Manager(commonsContext);
commonsContext.web3Manager = web3Manager;

export const networkManager = new NetworkManager(commonsContext);
commonsContext.networkManager = networkManager;

export const messageManager = new MessageManager();
commonsContext.messageManager = messageManager;

export const transactionManager = new TransactionManager();
commonsContext.transactionManager = transactionManager;

export const erc20ContractApi = new ERC20ContractApi(commonsContext);
commonsContext.erc20ContractApi = erc20ContractApi;

export const accountManager = new AccountManager(commonsContext);
commonsContext.accountManager = accountManager;

export const adminContractApi = new AdminContractApi(commonsContext);
commonsContext.adminContractApi = adminContractApi;

export const ipfsService = new IpfsService(commonsContext);
commonsContext.ipfsService = ipfsService;

export const userIpfsConnector = new UserIpfsConnector(commonsContext);
commonsContext.userIpfsConnector = userIpfsConnector;

export const userService = new UserService(commonsContext);
commonsContext.userService = userService;

export const authService = new AuthService(commonsContext);
commonsContext.authService = authService;

export default commonsContext;