import Model from './Model';
import { cleanIpfsPath } from '../lib/helpers';
import BigNumber from 'bignumber.js';
import {
  CREATE_DAC_ROLE,
  CREATE_CAMPAIGN_ROLE,
  CREATE_MILESTONE_ROLE,
  CAMPAIGN_REVIEWER_ROLE,
  MILESTONE_REVIEWER_ROLE,
  RECIPIENT_ROLE
} from '../constants/Role';
import StatusUtils from '../utils/StatusUtils';
import Status from './Status';
import ipfsService from '../ipfs/IpfsService';

/**
 * Modelo de User en Dapp.
 *
 * @attribute address       Ethereum address of the user
 * @attribute balance       Balance de la cuenta del usuario medida en Wei.
 * @attribute tokenBalances Balances de los diferentes tokens de la cuenta del usuario medida en Wei.
 * @attribute avatar        URL to user avatar
 * @attribute email         Email address of the user
 * @attribute name          Name of the user
 * @attribute url           Url attached to LiquidPledging admin
 * @attribute authenticated If the user is authenticated w/ feathers
 */
class User extends Model {

  constructor(data = {}) {
    super(data);

    const {
      address = null,
      infoCid = '',
      avatarCid = '/ipfs/QmWCaq985NJjPnXhyDPQ4FPob8XNybncQqkQUZatySkY7E',
      avatar = '',
      name = '',
      email = '',
      url = '',
      roles = [],
      balance = new BigNumber(0),
      tokenBalances = new Map(),
      authenticated = false,
      registered = false,
      status = User.UNREGISTERED.toStore()
    } = data;

    if (data) {
      this._address = address;
      this._infoCid = infoCid;
      this._avatarCid = avatarCid;
      this._name = name;
      this._avatar = avatar;
      this._email = email;
      this._url = url;
      this._roles = roles;
      this._balance = balance;
      this._tokenBalances = tokenBalances;
      this._authenticated = authenticated;
      this._registered = registered;
      this._status = StatusUtils.build(status.name, status.isLocal);
    }
  }

  toIpfs() {
    return {
      avatarCid: cleanIpfsPath(this._avatarCid)
    };
  }

  toFeathers() {
    return {
      address: this._address,
      name: this._name,
      email: this._email,
      url: this._url,
      infoCid: this._infoCid
    };  
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      address: this._address,
      infoCid: this._infoCid,
      avatarCid: this._avatarCid,
      name: this._name,
      email: this._email,
      url: this._url,
      avatar: this._avatar,
      roles: this._roles,
      balance: this._balance,
      tokenBalances: this._tokenBalances,
      authenticated: this._authenticated,
      registered: this._registered,
      status: this._status.toStore()
    }
  }

  static get UNREGISTERED() {
    return StatusUtils.build('Unregistered');
  }

  static get REGISTERED() {
    return StatusUtils.build('Registered');
  }

  static get REGISTERING() {
    return StatusUtils.build('Registering', true);
  }

  /**
   * Indica si el usuario está registrado en este momento.
   */
  get isRegistered() {
    return this.status.name === User.REGISTERED.name;
  }

  // eslint-disable-next-line class-methods-use-this
  get type() {
    return 'giver';
  }

  get address() {
    return this._address;
  }

  set address(value) {
    this.checkType(value, ['undefined', 'string'], 'address');
    this._address = value;
  }

  get infoCid() {
    return this._infoCid;
  }

  set infoCid(value) {
    this._infoCid = value;
  }

  get avatarCid() {
    return this._avatarCid;
  }

  set avatarCid(value) {
    this._avatarCid = value;
  }


  get avatar() {
    return this._avatar;
  }

  /**
    * Obtiene la URL completa del avatar.
    */
  get avatarCidUrl() {
    return ipfsService.resolveUrl(this._avatarCid)
  }

  

  set avatar(value) {
    this.checkType(value, ['undefined', 'string'], 'avatar');
    this._avatar = value;
  }

  set newAvatar(value) {
    this.checkType(value, ['string'], 'newAvatar');
    this._newAvatar = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    this.checkType(value, ['undefined', 'string'], 'email');
    this._email = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this.checkType(value, ['undefined', 'string'], 'name');
    this._name = value;
  }

  get url() {
    return this._url;
  }

  set url(value) {
    this.checkType(value, ['undefined', 'string'], 'url');
    this._url = value;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(value) {
    this.checkType(value, ['undefined', 'string'], 'updatedAt');
    this._updatedAt = value;
  }

  get authenticated() {
    return this._authenticated;
  }

  set authenticated(value) {
    this.checkType(value, ['boolean'], 'authenticated');
    this._authenticated = value;
  }

  get registered() {
    return this._registered;
  }

  set registered(value) {
    this.checkType(value, ['boolean'], 'registered');
    this._registered = value;
  }
  get roles() {
    return this._roles;
  }

  set roles(value) {
    this._roles = value;
  }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this.checkInstanceOf(value, BigNumber, 'balance');
    this._balance = value;
  }

  get tokenBalances() {
    return this._tokenBalances;
  }

  set tokenBalances(value) {
    this._tokenBalances = value;
  }

  hasRole(role){
    return this.roles.includes(role);
  }

  hasAnyRoles(roles){ //roles should be an array
    let found = false;

    for (const wanted of roles) {
      found = this.roles.includes(wanted);
      if (found) break;
    } 

    return found;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this.checkInstanceOf(value, Status, 'status');
    this._status = value;
  }

  isDelegate() {
    return this.roles.includes(CREATE_DAC_ROLE);
  }
  isCampaignManager() {
    return this.roles.includes(CREATE_CAMPAIGN_ROLE);
  }
  isMilestoneManager() {
    return this.roles.includes(CREATE_MILESTONE_ROLE);
  }
  isCampaignReviewer() {
    return this.roles.includes(CAMPAIGN_REVIEWER_ROLE);
  }
  isMilestoneReviewer() {
    return this.roles.includes(MILESTONE_REVIEWER_ROLE);
  }
  isRecipient() {
    return this.roles.includes(RECIPIENT_ROLE);
  }


  hasCompleteProfile(){
    let hasCompleteProfile = true;
    const requiredProperties = ["address", "name", "email", "url", "avatar"];

    for(const prop of requiredProperties){
      if (this[prop] == undefined || this[prop].trim() == "") {
        hasCompleteProfile = false;
        break;
      }
    }

    return hasCompleteProfile;
  }



}

export default User;
