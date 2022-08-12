const {
  REACT_APP_ENVIRONMENT = 'localhost', // optional
  REACT_APP_DECIMALS = 8, // optional
  REACT_APP_FEATHERJS_USERS_CONNECTION_URL,
  REACT_APP_NODE_CONNECTION_URL,
  REACT_APP_CROWDFUNDING_ADDRESS,
  REACT_APP_EXCHANGE_RATE_PROVIDER_ADDRESS,
  REACT_APP_TOKEN_RIF_ADDRESS,
  REACT_APP_TOKEN_DOC_ADDRESS,
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
      name: 'RSK Regtest',
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
      rbtc: {
        address: '0x0000000000000000000000000000000000000000',
        isNative: true,
        symbol: 'RBTC',
        logoCid: '/ipfs/QmRqPw4gVDv4uNaMzpJ1tjwm85CZysQAKTR8KfqzQzrr8B',
        showDecimals: 5,
        donateStep: 0.00001
      },
      rif: { // ERC677 Token
        address: '0x1111111111111111111111111111111111111111',
        isNative: false,
        symbol: 'dRIF',
        logoCid: '/ipfs/QmcvQL7Yj4tryAmZPEB8qgeU1JwJNZAVN4zCcdWBNBkbQ9',
        showDecimals: 2,
        donateStep: 0.01
      },
      doc: {
        address: '0x2222222222222222222222222222222222222222',
        isNative: false,
        symbol: 'DOC',
        logoCid: '/ipfs/QmS3XYpbPycRUmtqogrnr4REEF3St2Yu4MqUwjSoxBDjUE',
        showDecimals: 2,
        donateStep: 0.01
      }
    },
    tokenExchangeRate: {
      updateInterval: 60000
    },
    anonymousDonationThreshold: 5000,
    dac: {
      defaultId: 1
    },
    categories: [
      1, // Inclusión Financiera.
      2, // Agricultura sostenible
      3, // Acceso a mercados
      4, // Adaptación climática
      5  // Sostenimiento de Give4Forest
    ],
    team: {
      primary: [
        {
          name: "Mauricio M.",
          role: "Advisor",
          photoCid: "/ipfs/QmeCYvNowpitxcpR2Xs85cykjUksew2kuNJqzzbKL8onxf"
        },
        {
          name: "Stephanie L.",
          role: "Advisor",
          photoCid: "/ipfs/QmeCYvNowpitxcpR2Xs85cykjUksew2kuNJqzzbKL8onxf"
        }
      ],
      secondary: [
        {
          name: "Belén Arostegui",
          role: "Marketing & Communications"
        },
        {
          name: "Mauricio Coronel",
          role: "Developer IT (ver)"
        },
        {
          name: "Lucía B. Cueto",
          role: "Exp. & Program Devel. Manager"
        },
        {
          name: "Gonzalo Paz",
          role: "Social Media Manager"
        },
      ]
    }
  },
  rsk_testnet: {
    network: {
      requiredId: 31,
      name: 'RSK Testnet',
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
      rbtc: {
        address: '0x0000000000000000000000000000000000000000',
        isNative: true,
        symbol: 'RBTC',
        logoCid: '/ipfs/QmRqPw4gVDv4uNaMzpJ1tjwm85CZysQAKTR8KfqzQzrr8B',
        showDecimals: 5,
        donateStep: 0.00001
      },
      rif: { // ERC677 Token
        address: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
        isNative: false,
        symbol: 'tRIF',
        logoCid: '/ipfs/QmcvQL7Yj4tryAmZPEB8qgeU1JwJNZAVN4zCcdWBNBkbQ9',
        showDecimals: 2,
        donateStep: 0.01
      },
      doc: {
        address: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
        isNative: false,
        symbol: 'DOC',
        logoCid: '/ipfs/QmS3XYpbPycRUmtqogrnr4REEF3St2Yu4MqUwjSoxBDjUE',
        showDecimals: 2,
        donateStep: 0.01
      }
    },
    tokenExchangeRate: {
      updateInterval: 60000
    },
    anonymousDonationThreshold: 10000,
    dac: {
      defaultId: 1
    },
    categories: [
      1, // Inclusión Financiera.
      2, // Agricultura sostenible
      3, // Acceso a mercados
      4, // Adaptación climática
      5  // Sostenimiento de Give4Forest
    ],
    team: {
      primary: [
        {
          name: "Mauricio M.",
          role: "Advisor",
          photoCid: "/ipfs/QmeCYvNowpitxcpR2Xs85cykjUksew2kuNJqzzbKL8onxf"
        },
        {
          name: "Stephanie L.",
          role: "Advisor",
          photoCid: "/ipfs/QmeCYvNowpitxcpR2Xs85cykjUksew2kuNJqzzbKL8onxf"
        }
      ],
      secondary: [
        {
          name: "Belén Arostegui",
          role: "Marketing & Communications"
        },
        {
          name: "Mauricio Coronel",
          role: "Developer IT (ver)"
        },
        {
          name: "Lucía B. Cueto",
          role: "Exp. & Program Devel. Manager"
        },
        {
          name: "Gonzalo Paz",
          role: "Social Media Manager"
        },
      ]
    }
  },
  rsk_mainnet: {
    network: {
      requiredId: 30,
      name: 'RSK Mainnet',
      nodeUrl: 'https://node.b4h.world',
      timeout: 20000,
      explorer: 'https://explorer.rsk.co/',
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
      rbtc: {
        address: '0x0000000000000000000000000000000000000000',
        isNative: true,
        symbol: 'RBTC',
        logoCid: '/ipfs/QmRqPw4gVDv4uNaMzpJ1tjwm85CZysQAKTR8KfqzQzrr8B',
        showDecimals: 5,
        donateStep: 0.00001
      },
      rif: { // ERC677 Token
        address: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
        isNative: false,
        symbol: 'RIF',
        logoCid: '/ipfs/QmcvQL7Yj4tryAmZPEB8qgeU1JwJNZAVN4zCcdWBNBkbQ9',
        showDecimals: 2,
        donateStep: 0.01
      },
      doc: {
        address: '0xe700691dA7b9851F2F35f8b8182c69c53CcaD9Db',
        isNative: false,
        symbol: 'DOC',
        logoCid: '/ipfs/QmS3XYpbPycRUmtqogrnr4REEF3St2Yu4MqUwjSoxBDjUE',
        showDecimals: 2,
        donateStep: 0.01
      }
    },
    tokenExchangeRate: {
      updateInterval: 60000
    },
    anonymousDonationThreshold: 10000,
    dac: {
      defaultId: 1
    },
    categories: [
      1, // Inclusión Financiera.
      2, // Agricultura sostenible
      3, // Acceso a mercados
      4, // Adaptación climática
      5  // Sostenimiento de Give4Forest
    ],
    team: {
      primary: [
        {
          name: "Mauricio M.",
          role: "Advisor",
          photoCid: "/ipfs/QmeCYvNowpitxcpR2Xs85cykjUksew2kuNJqzzbKL8onxf"
        },
        {
          name: "Stephanie L.",
          role: "Advisor",
          photoCid: "/ipfs/QmeCYvNowpitxcpR2Xs85cykjUksew2kuNJqzzbKL8onxf"
        }
      ],
      secondary: [
        {
          name: "Belén Arostegui",
          role: "Marketing & Communications"
        },
        {
          name: "Mauricio Coronel",
          role: "Developer IT (ver)"
        },
        {
          name: "Lucía B. Cueto",
          role: "Exp. & Program Devel. Manager"
        },
        {
          name: "Gonzalo Paz",
          role: "Social Media Manager"
        },
      ]
    }
  }
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
config.tokens.doc.address = REACT_APP_TOKEN_DOC_ADDRESS || config.tokens.doc.address;
config.tokens.rif.address = REACT_APP_TOKEN_RIF_ADDRESS || config.tokens.rif.address;
config.liquidPledgingAddress = REACT_APP_LIQUIDPLEDGING_ADDRESS || config.liquidPledgingAddress;
config.campaignFactoryAddress =
  REACT_APP_CAMPAIGN_FACTORY_ADDRESS || config.lppCampaignFactoryAddress;
config.cappedMilestoneFactoryAddress =
  REACT_APP_CAPPED_MILESTONE_FACTORY_ADDRESS || config.lppCappedMilestoneFactoryAddress;
config.tokenAddresses = REACT_APP_TOKEN_ADDRESSES
  ? JSON.parse(REACT_APP_TOKEN_ADDRESSES)
  : config.tokenAddresses;
config.etherscan = REACT_APP_BLOCKEXPLORER || config.etherscan;
config.feathersUsersConnection = REACT_APP_FEATHERJS_USERS_CONNECTION_URL || config.feathersUsersConnection;
config.network.nodeUrl = REACT_APP_NODE_CONNECTION_URL || config.network.nodeUrl;
config.network.requiredId = (REACT_APP_NODE_ID && Number.parseInt(REACT_APP_NODE_ID, 10)) || config.nodeId;
config.decimals = REACT_APP_DECIMALS;
config.bugsEmail = REACT_APP_BUGS_EMAIL;
config.networkName = REACT_APP_NETWORK_NAME || config.networkName;
config.nodeId = (REACT_APP_NODE_ID && Number.parseInt(REACT_APP_NODE_ID, 10)) || config.nodeId;
config.nativeTokenName = REACT_APP_NATIVE_TOKEN_NAME || config.nativeTokenName;

config.ipfsGateway = REACT_APP_IPFS_GATEWAY || config.ipfsGateway;
config.ipfsPinningEnabled = (REACT_APP_IPFS_PINNING_ENABLED !== undefined) ? (REACT_APP_IPFS_PINNING_ENABLED == "true") : config.ipfsPinningEnabled;

config.anonymousDonationThreshold = REACT_APP_ANONYMOUS_DONATION_THRESHOLD || config.anonymousDonationThreshold;


//config.sendErrors = ['develop', 'release', 'beta', 'rsk_testnet'].includes(REACT_APP_ENVIRONMENT);

// Definición de Roles

config.ADMIN_ROLE = "ADMIN_ROLE";
config.GIVER_ROLE = "GIVER_ROLE";
config.DELEGATE_ROLE = "DELEGATE_ROLE";
config.CAMPAIGN_MANAGER_ROLE = "CAMPAIGN_MANAGER_ROLE";
config.CAMPAIGN_REVIEWER_ROLE = "CAMPAIGN_REVIEWER_ROLE";
config.MILESTONE_MANAGER_ROLE = "MILESTONE_MANAGER_ROLE";
config.MILESTONE_REVIEWER_ROLE = "MILESTONE_REVIEWER_ROLE";
config.RECIPIENT_ROLE = "RECIPIENT_ROLE";

config.roles = [
  {
    value: config.ADMIN_ROLE,
    hash: "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
    label: 'Admin',
    app: config.adminContractAddress
  },
  {
    value: config.DELEGATE_ROLE,
    hash: "0x1a82baf2b928242f69f7147fb92490c6288d044f7257b88817e6284f1eec0f15",
    label: "Delegate",
    app: config.crowdfundingAddress
  },
  {
    value: config.CAMPAIGN_MANAGER_ROLE,
    hash: "0x5022544358ee0bece556b72ae8983c7f24341bd5b9483ce8a19bff5efbb2de92",
    label: "Campaign Manager",
    app: config.crowdfundingAddress
  },
  {
    value: config.CAMPAIGN_REVIEWER_ROLE,
    hash: "0x634e3ca2e6368700bbf08d9508419cd87488d87c36c701a117b27ea1e3efb94e",
    label: "Campaign Reviewer",
    app: config.crowdfundingAddress
  },
  {
    value: config.MILESTONE_MANAGER_ROLE,
    hash: "0xa3a2c0788fca84104c8a174fd5021fe337cdd81ef2dab39dfed0f397582c2efb",
    label: "Milestone Manager",
    app: config.crowdfundingAddress
  },
  {
    value: config.MILESTONE_REVIEWER_ROLE,
    hash: "0x4d6e65593aeec72da9930817128ec8271cfd271f40a90712d7163837a7835ede",
    label: "Milestone Reviewer",
    app: config.crowdfundingAddress
  },
  {
    value: config.RECIPIENT_ROLE,
    hash: "0x8b42d4fd5c2527b7732a4b075ccb928f88ffc087de1e4c401c8fc7ab80ea882e",
    label: "Recipient",
    app: config.crowdfundingAddress
  }
];

console.log('Configuración', config);

export default config;