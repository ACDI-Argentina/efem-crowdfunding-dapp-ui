import Web3Utils from 'lib/blockchain/Web3Utils';
import config from '../configuration';

/**
 * Clase utilitaria para el manejo de tokens.
 */
class TokenUtils {

  /**
   * Formatea el monto crypto pasado como parámetro
   * 
   * @param tokenAddress token
   * @param amount monto en wei a formatear.
   */
  static format(tokenAddress, amount) {
    let tokenConfig = TokenUtils.getTokenConfig(tokenAddress);
    let amountEther = Web3Utils.weiToEther(amount).toFixed(tokenConfig.showDecimals);
    let symbol = tokenConfig.symbol;
    return amountEther + ' ' + symbol;
  }

  /**
   * Obtiene la configuración para un token dado.
   * @param tokenAddress dirección del token
   * @returns configuración del token.
   */
  static getTokenConfig(tokenAddress) {
    let tokenConfig = {};
    let tokenKeys = Object.keys(config.tokens);
    for (let i = 0; i < tokenKeys.length; i++) {
      const tokenKey = tokenKeys[i];
      if(Web3Utils.addressEquals(config.tokens[tokenKey].address, tokenAddress)) {
        tokenConfig = config.tokens[tokenKey];
        break;
      } 
    }
    return tokenConfig;
  }
}

export default TokenUtils;
