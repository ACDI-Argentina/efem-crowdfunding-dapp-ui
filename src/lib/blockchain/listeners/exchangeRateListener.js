import exchangeRateUtils from "../../../redux/utils/exchangeRateUtils";
import { ExchangeRate } from '@acdi/efem-dapp';
import BigNumber from 'bignumber.js';
import config from 'configuration';
import crowdfundingContractApi from '../CrowdfundingContractApi';

window.ExchangeRate = ExchangeRate;
window.BigNumber = BigNumber;

/**
 * Inicializa la escucha sobre los cambios en los exchange rates.
 * 
 * Esta implementación hace polling, consultando los exchanges rates cada cierto tiempo.
 * 
 * Otra implementación más conveniente sería escuchar sobre eventos producidos en la blockchain
 * una vez que el exchange rate de un token cambia.
 */
async function initExchangeRateListener() {

    console.log("Listener sobre actualizaciones de Exchange Rate.");

    async function fetchExchangeRate() {

        let tokenKeys = Object.keys(config.tokens);
        for (let i = 0; i < tokenKeys.length; i++) {
            let tokenKey = tokenKeys[i];
            try {
                const tokenAddress = config.tokens[tokenKey].address;
                const rate = await crowdfundingContractApi.getExchangeRateByToken(tokenAddress);
                const exchangeRate = new ExchangeRate({
                    tokenAddress: tokenAddress,
                    rate: new BigNumber(rate),
                    date: Date.now()
                });
                console.log('Actualización de Exchange Rate.', exchangeRate);
                exchangeRateUtils.updateExchangeRate(exchangeRate);
            } catch (e) {
                console.error(`Error actualizando exchange rate de token ${tokenKey}.`, e);
            }
        }
    }

    // Se obtiene el exchange rate por primera vez.
    await fetchExchangeRate();

    // Se programa la obtención del exchange rate cada cierto intervalo.
    setInterval(
        fetchExchangeRate,
        config.tokenExchangeRate.updateInterval
    );
}

export default initExchangeRateListener;