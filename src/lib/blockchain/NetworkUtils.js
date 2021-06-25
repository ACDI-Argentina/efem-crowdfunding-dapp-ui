import Bowser from 'bowser';

// Validates user's browser is web3 capable
const funcs = {
  browserIsWeb3Capable: () => {
    // User Agent
    const browser = Bowser.getParser(window.navigator.userAgent);
    const userAgent = browser.parse().parsedResult;

    const validBrowser = browser.satisfies({
      desktop: {
        chrome: '>49',
        firefox: '>52',
        opera: '>36',
      },
    })
      ? true
      : false;

    const web3Capable = validBrowser || funcs.hasWeb3Available();

    return web3Capable;
  },

  // Current browser is detected as mobile
  isMobileDevice: () => {
    const mobilePlatform = /Mobi|Android/i.test(navigator.userAgent)
      ? true
      : false;

    return mobilePlatform;
  },

  // Checks browser window for available web3 or ethereum objects
  hasWeb3Available: () => {
    const web3 = typeof window.web3 !== 'undefined';
    const ethereum = typeof window.ethereum !== 'undefined';
    const web3Available = web3 || ethereum;

    return web3Available;
  },
};

export default funcs;
