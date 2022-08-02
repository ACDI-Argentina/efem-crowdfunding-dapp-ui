import Entity from './Entity';
import { StatusUtils } from '@acdi/efem-dapp';
import { Status } from '@acdi/efem-dapp';
import { web3Utils } from 'commons';

/**
 * The DApp DAC model
 */
class DAC extends Entity {

  constructor(data = {}) {
    super(data);
    const {
      campaignIds = [],
      delegateAddress = '',
      status = DAC.PENDING.toStore(),
    } = data;

    this._campaignIds = campaignIds;
    this._status = StatusUtils.build(undefined, status.name, status.isLocal);
    this._delegateAddress = delegateAddress;
    this._delegateId = delegateAddress;
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    let entityStore = super.toStore();
    return Object.assign(entityStore, {
      campaignIds: this._campaignIds,
      delegateAddress: this._delegateAddress,
      delegateId: this._delegateId,
      status: this._status.toStore()
    });
  }

  static get PENDING() {
    return StatusUtils.build(undefined, 'Pending', true);
  }

  static get ACTIVE() {
    return StatusUtils.build(0, 'Active');
  }

  static get CANCELLED() {
    return StatusUtils.build(1, 'Cancelled');
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

  get delegateAddress() {
    return this._delegateAddress;
  }

  get delegateId() {
    return this._delegateId;
  }

  set delegateId(value) {
    this._delegateId = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
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