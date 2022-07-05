import Entity from './Entity';
import StatusUtils from '../utils/StatusUtils';
import Status from './Status';
import { web3Utils } from 'commons';

/**
 * The DApp DAC model
 */
class DAC extends Entity {

  constructor(data = {}) {
    super(data);

    const {
      campaignIds = [],
      communityUrl = '',
      delegateAddress = '',
      requiredConfirmations = '',
      commitTime,
      status = DAC.PENDING.toStore(),
    } = data;

    this._campaignIds = campaignIds;
    this._communityUrl = communityUrl;
    this._status = StatusUtils.build(status.name, status.isLocal);
    this._delegateAddress = delegateAddress;
    this._requiredConfirmations = requiredConfirmations;
    this._commitTime = commitTime;
    this._delegateId = delegateAddress;
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    let entityStore = super.toStore();
    return Object.assign(entityStore, {
      campaignIds: this._campaignIds,
      communityUrl: this._communityUrl,
      delegateAddress: this._delegateAddress,
      requiredConfirmations: this._requiredConfirmations,
      commitTime: this._commitTime,
      delegateId: this._delegateId,
      status: this._status.toStore()
    });
  }

  static get PENDING() {
    return StatusUtils.build('Pending', true);
  }

  static get ACTIVE() {
    return StatusUtils.build('Active');
  }

  static get CANCELLED() {
    return StatusUtils.build('Cancelled');
  }

  static get type() {
    return 'dac';
  }

  get type() {
    return DAC.type;
  }

  get isActive() {
    return this.status.name === DAC.ACTIVE.name;
  }

  get isPending() {
    return this.status.name === DAC.PENDING.name;
  }

  get campaignIds() {
    return this._campaignIds;
  }

  set campaignIds(value) {
    this._campaignIds = value;
  }

  get communityUrl() {
    return this._communityUrl;
  }

  set communityUrl(value) {
    this.checkType(value, ['string'], 'communityUrl');
    this._communityUrl = value;
  }


  get delegateAddress() {
    return this._delegateAddress;
  }

  get delegateId() {
    return this._delegateId;
  }

  set delegateId(value) {
    this.checkType(value, ['number', 'string'], 'delegateId');
    this._delegateId = value;
  }

  get commitTime() {
    return this._commitTime;
  }

  set commitTime(value) {
    this.checkType(value, ['number'], 'commitTime');
    this._commitTime = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this.checkInstanceOf(value, Status, 'status');
    this._status = value;
  }

  /**
   * Determina si la entidad recibe fondos o no.
   */
  get canReceiveFunds() {
    return this.isActive;
  }

  /**
   * Determina si el usuario es el delegate de la dac.
   * 
   * @param user a determinar si es el delegate de la dac.
   */
  isDelegate(user) {
    return user && web3Utils.addressEquals(user.address, this.delegateAddress);
  }



}

export default DAC;