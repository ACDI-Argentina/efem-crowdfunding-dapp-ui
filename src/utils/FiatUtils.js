import BigNumber from 'bignumber.js';
import { utils } from 'web3';
import config from '../configuration';

/**
 * Clase utilitaria para el manejo de dinero Fiat.
 * 
 * Si bien se hace referencia al dolar en los nombres de los métodos,
 * éstos son agnósticos de la moneda.
 * 
 * Se requiere que la momeda sea sub divisible por 100 unidades.
 */
class FiatUtils {

  /**
   * Convierte los centavos en dólares.
   *
   * @param centAmount cantidad de centavos a converir a en dolar.
   * @returns equivalente en dolares de los centavos pasado como parámetro.
   */
  static centToDollar(centAmount) {
    return centAmount.dividedBy(100);
  }

  /**
   * Convierte los dolares en centavos.
   *
   * @param dollarAmount cantidad de dólares a converir a en centavos.
   * @returns equivalente en centavos de los dólares pasado como parámetro.
   */
  static dollarToCent(dollarAmount) {
    return dollarAmount.multipliedBy(100);
  }

  /**
   * Formatea el monto pasado como parámetro como moneda FIAT con el símbolo por defecto.
   * 
   * @param centAmount monto en centavos a formatear.
   */
  static format(centAmount) {
    let fiatConfig = config.fiat;
    let amount = FiatUtils.centToDollar(centAmount).toFixed(fiatConfig.showDecimals);
    let symbol = fiatConfig.symbol;
    return symbol + ' ' + amount;
  }
}

export default FiatUtils;
