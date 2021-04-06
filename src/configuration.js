const {
  REACT_APP_ENVIRONMENT = 'localhost', // optional
  REACT_APP_DECIMALS = 8, // optional
  REACT_APP_FEATHERJS_CONNECTION_URL,
  REACT_APP_NODE_CONNECTION_URL,
  REACT_APP_CROWDFUNDING_ADDRESS,
  REACT_APP_EXCHANGE_RATE_PROVIDER_ADDRESS,
  REACT_APP_LIQUIDPLEDGING_ADDRESS,
  REACT_APP_CAMPAIGN_FACTORY_ADDRESS,
  REACT_APP_CAPPED_MILESTONE_FACTORY_ADDRESS,
  REACT_APP_TOKEN_ADDRESSES,
  REACT_APP_BLOCKEXPLORER,
  REACT_APP_BUGS_EMAIL = 'give4forests@acdi.org.ar',
  REACT_APP_NETWORK_NAME,
  REACT_APP_NATIVE_TOKEN_NAME,
  REACT_APP_NODE_ID,
  REACT_APP_IPFS_GATEWAY,
  REACT_APP_IPFS_PINNING_ENABLED,
  REACT_APP_ANONYMOUS_DONATION_THRESHOLD, //In fiat amount
} = process.env;

const configurations = {
  localhost: {
    network: {
      requiredId: 33,
      nodeUrl: 'http://localhost:4444',
      timeout: 20000,
      explorer: 'https://explorer.testnet.rsk.co/',
      transactionEstimatedTime: 1, // Minutos
      transactionEstimatedTimeMilliseconds: 30000
    },
    language: {
      default: 'en',
      options: [
        { key: "es", name: "Español", flag: "ES" },
        { key: "en", name: "English", flag: "US" }
      ]
    },
    title: 'localhost',
    liquidPledgingAddress: '0x46579394802b5e4d2C0647436BFcc71A2d9E8478',
    lppCampaignFactoryAddress: '0xe3155F7A49897e7860476b5A625B258ebe43cA98',
    lppCappedMilestoneFactoryAddress: '0x1b6E4a9eB8264E46784a782c87e3529E203425Ca',
    networkName: 'ganache',
    nodeId: 88,
    etherscan: 'https://explorer.testnet.rsk.co/', // this won't work, only here so we can see links during development
    feathersConnection: 'http://localhost:3030',
    ipfsGateway: 'http://localhost:8080/ipfs/',
    ipfsPinningEnabled: true,
    sendErrors: true,
    analytics: {
      ga_UA: 'UA-136337883-3',
      useGoogleAnalytics: true,
      useHotjar: false,
    },
    nativeTokenName: 'RBTC',
    nativeToken: {
      name: 'RBTC',
      symbol: 'RBTC',
      address: '0x0000000000000000000000000000000000000000'
    },
    fiat: {
      symbol: 'USD',
      showDecimals: 2
    },
    tokens: {
      // Token Nativo
      '0x0000000000000000000000000000000000000000': {
        symbol: 'RBTC',
        logoCid: '/ipfs/QmTsctkHWeVcuz6z2AWdi5zv3YCcVWSbmg2XF3tVs8jfn1',
        showDecimals: 5
      }
    },
    anonymousDonationThreshold: 5000
  },
  rsk_testnet: {
    network: {
      requiredId: 31,
      nodeUrl: 'https://public-node.testnet.rsk.co',
      timeout: 20000,
      explorer: 'https://explorer.testnet.rsk.co/',
      transactionEstimatedTime: 1, // Minutos
      transactionEstimatedTimeMilliseconds: 32000
    },
    language: {
      default: 'en',
      options: [
        { key: "es", name: "Español", flag: "ES" },
        { key: "en", name: "English", flag: "US" }
      ]
    },
    title: 'RSK Testnet',
    liquidPledgingAddress: '0x581A2751C29F030730c99f9435c5f34A82BF4969',
    lppCampaignFactoryAddress: '0xcb5eea43731E1058e5c8FBc989CB2E221602Fb67',
    lppCappedMilestoneFactoryAddress: '0x43E3fC1f59C367b34Cab072AFb2dFE8CEA1CBAFa',
    networkName: 'rsk_testnet',
    nodeId: 31,
    etherscan: 'https://explorer.testnet.rsk.co/',
    feathersConnection: 'https://testnet.feathers.b4h.world',
    ipfsGateway: 'https://testnet.ipfs.b4h.world/ipfs/',
    ipfsPinningEnabled: true,
    sendErrors: true,
    analytics: {
      ga_UA: 'UA-136337883-2',
      useGoogleAnalytics: true,
      useHotjar: false,
    },
    nativeTokenName: 'RBTC',
    nativeToken: {
      name: 'RBTC',
      symbol: 'RBTC',
      address: '0x0000000000000000000000000000000000000000'
    },
    fiat: {
      symbol: 'USD',
      showDecimals: 2
    },
    tokens: {
      // Token Nativo
      '0x0000000000000000000000000000000000000000': {
        symbol: 'RBTC',
        logoCid: '/ipfs/QmTsctkHWeVcuz6z2AWdi5zv3YCcVWSbmg2XF3tVs8jfn1',
        showDecimals: 5
      }
    },
    anonymousDonationThreshold: 10000
  },
  rsk_mainnet: {
    network: {
      requiredId: 30,
      nodeUrl: 'https://node.b4h.world',
      timeout: 20000,
      explorer: 'https://explorer.testnet.rsk.co/',
      transactionEstimatedTime: 1, // Minutos
      transactionEstimatedTimeMilliseconds: 60000
    },
    language: {
      default: 'en',
      options: [
        { key: "es", name: "Español", flag: "ES" },
        { key: "en", name: "English", flag: "US" }
      ]
    },
    title: 'RSK MainNet',
    liquidPledgingAddress: '0x86Fd7661114Ca0Cf959337CB7DAFbBE93dB248d2',
    lppCampaignFactoryAddress: '0xB874E4B1F4DBEEBCBdB8150EA8c71c3E96FCb40E',
    lppCappedMilestoneFactoryAddress: '0x95655dC505233d40e2c5A1d4590d142C8a721cb4',
    networkName: 'rsk_mainnet',
    nodeId: 30,
    etherscan: 'https://explorer.rsk.co/',
    feathersConnection: 'https://feathers.b4h.world',
    ipfsGateway: 'https://ipfs.b4h.world/ipfs/',
    ipfsPinningEnabled: true,
    sendErrors: true,
    analytics: {
      ga_UA: 'UA-136337883-1',
      useGoogleAnalytics: true,
      useHotjar: false,
    },
    nativeTokenName: 'RBTC',
    nativeToken: {
      name: 'RBTC',
      symbol: 'RBTC',
      address: '0x0000000000000000000000000000000000000000'
    },
    fiat: {
      symbol: 'USD',
      showDecimals: 2
    },
    tokens: {
      // Token Nativo
      '0x0000000000000000000000000000000000000000': {
        symbol: 'RBTC',
        logoCid: '/ipfs/QmTsctkHWeVcuz6z2AWdi5zv3YCcVWSbmg2XF3tVs8jfn1',
        showDecimals: 5
      }
    }
  },
  anonymousDonationThreshold: 10000
};

// Unknown environment
if (configurations[REACT_APP_ENVIRONMENT] === undefined)
  throw new Error(
    `There is no configuration object for environment: ${REACT_APP_ENVIRONMENT}. Expected REACT_APP_ENVIRONMENT to be empty or one of: ${Object.keys(
      configurations,
    )}`,
  );

// Create config object based on environment setup
const config = Object.assign({}, configurations[REACT_APP_ENVIRONMENT]);

// Overwrite the environment values with parameters
config.crowdfundingAddress = REACT_APP_CROWDFUNDING_ADDRESS || config.crowdfundingAddress;
config.exchangeRateProviderAddress = REACT_APP_EXCHANGE_RATE_PROVIDER_ADDRESS || config.exchangeRateProviderAddress;
config.liquidPledgingAddress = REACT_APP_LIQUIDPLEDGING_ADDRESS || config.liquidPledgingAddress;
config.campaignFactoryAddress =
  REACT_APP_CAMPAIGN_FACTORY_ADDRESS || config.lppCampaignFactoryAddress;
config.cappedMilestoneFactoryAddress =
  REACT_APP_CAPPED_MILESTONE_FACTORY_ADDRESS || config.lppCappedMilestoneFactoryAddress;
config.tokenAddresses = REACT_APP_TOKEN_ADDRESSES
  ? JSON.parse(REACT_APP_TOKEN_ADDRESSES)
  : config.tokenAddresses;
config.etherscan = REACT_APP_BLOCKEXPLORER || config.etherscan;
config.feathersConnection = REACT_APP_FEATHERJS_CONNECTION_URL || config.feathersConnection;
config.network.nodeUrl = REACT_APP_NODE_CONNECTION_URL || config.network.nodeUrl;
config.decimals = REACT_APP_DECIMALS;
config.bugsEmail = REACT_APP_BUGS_EMAIL;
config.networkName = REACT_APP_NETWORK_NAME || config.networkName;
config.nodeId = (REACT_APP_NODE_ID && Number.parseInt(REACT_APP_NODE_ID, 10)) || config.nodeId;
config.nativeTokenName = REACT_APP_NATIVE_TOKEN_NAME || config.nativeTokenName;

config.ipfsGateway = REACT_APP_IPFS_GATEWAY || config.ipfsGateway;
config.ipfsPinningEnabled = (REACT_APP_IPFS_PINNING_ENABLED !== undefined) ? (REACT_APP_IPFS_PINNING_ENABLED == "true") : config.ipfsPinningEnabled;

config.anonymousDonationThreshold = REACT_APP_ANONYMOUS_DONATION_THRESHOLD ||  config.anonymousDonationThreshold;


//config.sendErrors = ['develop', 'release', 'beta', 'rsk_testnet'].includes(REACT_APP_ENVIRONMENT);

console.log('Configuración', config);

export default config;