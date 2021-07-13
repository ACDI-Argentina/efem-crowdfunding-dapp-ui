import currentUserUtils from 'redux/utils/currentUserUtils';
import { BehaviorSubject } from 'rxjs'
import erc20ContractApi from '../../lib/blockchain/ERC20ContractApi';
import web3Manager from './Web3Manager';
import Account from 'models/Account';
import config from 'configuration';
import BigNumber from 'bignumber.js';

const POLLING_BALANCE_MS = 2000;



/**
 * Manager encargado de manejar la cuenta de una wallet.
 */
class AccountManager {

  constructor() {
    this.accountSubject = new BehaviorSubject(new Account());
    web3Manager.getWeb3().subscribe(web3 => {
      this.web3 = web3;
    });
    web3Manager.getAccountAddress().subscribe(async accountAddress => {
      await this.loadAccount(accountAddress);
    });
    
  }

  loadAccount = async (accountAddress) => {
    if (accountAddress == null) {
      // La cuenta no está definida, por lo que se reinicializa la cuenta.
      this.accountSubject.next(new Account());
      currentUserUtils.clearCurrentUser();
    } else {
      console.log(`[Account] Carga de cuenta conectada: ${accountAddress}`);
      let account = this.accountSubject.getValue();
      account.address = accountAddress;
      this.accountSubject.next(account);
      currentUserUtils.initCurrentUser(accountAddress);
      this.pollBalance(accountAddress);
    }    
  }

  pollBalance(accountAddress){
    clearInterval(this.intervalId);
    console.log(`pollBalance accountAddress`)
    this.intervalId = setInterval(() => this.updateAccountBalances(accountAddress),POLLING_BALANCE_MS)
  }

  /**
   * Actualiza los balances de la cuenta actual.
   * 
   * @param accountAddress address de la cuenta sobre la que se actualizan los balances.
   */
  updateAccountBalances = async (accountAddress) => {
    console.log(`update account balance`);

    let account = this.accountSubject.getValue();
    let changed = false;

    try {
      // Se obtiene el balance del token nativo.
      let balance = await this.web3.eth.getBalance(accountAddress);
      balance = new BigNumber(balance);
      // Solo se actualiza si cambió el balance.
      if (!balance.isEqualTo(account.balance)) {
        account.balance = balance;
        account.tokenBalances[config.nativeToken.address] = balance;
        changed = true;
        console.log('[Account] Nuevo balance.', config.nativeToken.address, this.formatBalance(balance,config.nativeToken.name));
      }
    } catch (error) {
      console.error("[Account] Error al obtener el balance nativo.", error);
    }

    // Se obtienen los balances de cada ERC20 token.        
    Object.keys(config.tokens).map(async tokenKey => {
      try {
        if (config.tokens[tokenKey].isNative === false) {
          const tokenSymbol = config.tokens[tokenKey].symbol;
          let tokenAddress = config.tokens[tokenKey].address;
          let tokenBalance = await erc20ContractApi.getBalance(tokenAddress, accountAddress);
          // Solo se actualiza si cambió el balance.
          if (!tokenBalance.isEqualTo(account.tokenBalances[tokenAddress])) {
            account.tokenBalances[tokenAddress] = tokenBalance;
            changed = true;
            console.log('[Account] Nuevo balance.', tokenAddress, this.formatBalance(tokenBalance,tokenSymbol));
          }
        }
      } catch (e) {
        console.error('[Account] Error obteniendo balance de ERC Token.', config.tokens[tokenKey], e);
      }
    });

    if (changed == true) {
      currentUserUtils.updateCurrentUserBalance(account.balance, account.tokenBalances);
      this.accountSubject.next(account);
    }
  };

  /**
   * Obtiene la instancia de la cuenta actual.
   * 
   * @returns account 
   */
  getAccount() {
    return this.accountSubject.asObservable();
  }

  logout(){
    console.log(`Account manager logout`); //Revisar si es necesario hacer otros cambiois
   clearInterval(this.intervalId); 
  }

  formatBalance = (balance,tokenSymbol) => { //BN instance
    const formattedBalance = parseFloat(this.web3.utils.fromWei(balance.toString()))?.toFixed(10);
    return `${formattedBalance} ${tokenSymbol}`; 
  }

}

export default new AccountManager();