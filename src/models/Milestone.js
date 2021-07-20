import Entity from './Entity';
import BigNumber from 'bignumber.js';
import { getStartOfDayUTC } from 'lib/helpers';
import StatusUtils from '../utils/StatusUtils';
import Status from './Status';
import Web3Utils from 'lib/blockchain/Web3Utils';

/**
 * Modelo Milestone de Dapp.
 */
export default class Milestone extends Entity {
  constructor(data = {}) {
    super(data);
    const {
      campaignId,
      fiatType = 'USD',
      fiatAmountTarget = new BigNumber(0),
      managerAddress = '',
      reviewerAddress = '',
      campaignReviewerAddress,
      recipientAddress = '',
      status = Milestone.PENDING.toStore(),
      items = [],
      activityIds = [],
      date = getStartOfDayUTC().subtract(1, 'd')
    } = data;
    this._campaignId = campaignId;
    this._fiatType = fiatType;
    this._fiatAmountTarget = fiatAmountTarget;
    this._managerAddress = managerAddress;
    this._reviewerAddress = reviewerAddress;
    this._recipientAddress = recipientAddress;
    this._campaignReviewerAddress = campaignReviewerAddress;
    this._activityIds = activityIds;
    this._status = StatusUtils.build(status.name, status.isLocal);

    // TODO Revisar
    //this._items = items.map(i => new Item(i));
    this._itemizeState = items && items.length > 0;
    this._date = getStartOfDayUTC(date);
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    let entityStore = super.toStore();
    return Object.assign(entityStore, {
      campaignId: this._campaignId,
      fiatType: this._fiatType,
      fiatAmountTarget: this._fiatAmountTarget,
      managerAddress: this._managerAddress,
      reviewerAddress: this._reviewerAddress,
      recipientAddress: this._recipientAddress,
      campaignReviewerAddress: this._campaignReviewerAddress,
      activityIds: this._activityIds,
      status: this._status.toStore()
    });
  }

  /**
   * Determina si el usuario es el manager del Milestone.
   * 
   * @param user a determinar si es el manager del milestone.
   */
  isManager(user) {
    return user && Web3Utils.addressEquals(user.address, this.managerAddress);
  }

  /**
   * Determina si el usuario es revisor del Milestone.
   * 
   * TODO Evaluar si el Campaign Reviewer debe considerarse como un reviewer normal.
   * 
   * @param user a determinar si es revisor del milestone.
   */
  isReviewer(user) {
    
    return user && (
      Web3Utils.addressEquals(user.address, this.reviewerAddress) || 
      Web3Utils.addressEquals(user.address, this.campaignReviewerAddress)
      );
  }

  /**
   * Determina si el usuario es el recipient del Milestone.
   * 
   * @param user a determinar si es el recipient del milestone.
   */
  isRecipient(user) {
    return user && Web3Utils.addressEquals(user.address, this.recipientAddress);
  }

  canComplete() {
    return this.isActive || this.isRejected;
  }

  canCancel() {
    return this.isActive;
  }

  /*TODO: CRITICAL: revisar funciones del milestoneManager, probablemente se pueda agregar una funcion isCampaignManager de ser necesario 
     en el modelo del milestone*/
  canUserEdit(user){
    return this.isManager(user);
  }

  inEditableStatus(){
    return this.isActive;
  }

  static get PENDING() {
    return StatusUtils.build('Pending', true);
  }

  static get ACTIVE() {
    return StatusUtils.build('Active');
  }

  static get CANCELLING() {
    return StatusUtils.build('Cancelling', true);
  }

  static get CANCELLED() {
    return StatusUtils.build('Cancelled');
  }

  static get COMPLETING() {
    return StatusUtils.build('Completing', true);
  }

  static get COMPLETED() {
    return StatusUtils.build('Completed');
  }

  static get APPROVING() {
    return StatusUtils.build('Appoving', true);
  }

  static get APPROVED() {
    return StatusUtils.build('Approved');
  }

  static get REJECTING() {
    return StatusUtils.build('Rejecting', true);
  }

  static get REJECTED() {
    return StatusUtils.build('Rejected');
  }

  static get PAYING() {
    return StatusUtils.build('Paying', true);
  }

  static get PAID() {
    return StatusUtils.build('Paid');
  }

  get isPending() {
    return this.status.name === Milestone.PENDING.name;
  }

  get isActive() {
    return this.status.name === Milestone.ACTIVE.name;
  }

  get isCompleted() {
    return this.status.name === Milestone.COMPLETED.name;
  }

  get isApproved() {
    return this.status.name === Milestone.APPROVED.name;
  }

  get isRejected() {
    return this.status.name === Milestone.REJECTED.name;
  }

  get isCancelled() {
    return this.status.name === Milestone.CANCELLED.name;
  }

  static get type() {
    return 'milestone';
  }

  // eslint-disable-next-line class-methods-use-this
  get type() {
    return Milestone.type;
  }

  get campaignId() {
    return this._campaignId;
  }

  set campaignId(value) {
    this.checkType(value, ['number'], 'campaignId');
    this._campaignId = value;
  }

  get fiatType() {
    return this._fiatType;
  }

  set fiatType(value) {
    this.checkType(value, ['string'], 'fiatType');
    this._fiatType = value;
  }

  get fiatAmountTarget() {
    return this._fiatAmountTarget;
  }

  set fiatAmountTarget(value) {
    this.checkInstanceOf(value, BigNumber, 'fiatAmountTarget');
    this._fiatAmountTarget = value;
  }

  get managerAddress() {
    return this._managerAddress;
  }

  set managerAddress(value) {
    this.checkType(value, ['string'], 'managerAddress');
    this._managerAddress = value;
  }

  get reviewerAddress() {
    return this._reviewerAddress;
  }

  set reviewerAddress(value) {
    this.checkType(value, ['string'], 'reviewerAddress');
    this._reviewerAddress = value;
  }

  get campaignReviewerAddress() {
    return this._campaignReviewerAddress;
  }

  set campaignReviewerAddress(value) {
    this.checkType(value, ['string'], 'campaignReviewerAddress');
    this._campaignReviewerAddress = value;
  }

  get recipientAddress() {
    return this._recipientAddress;
  }

  set recipientAddress(value) {
    this.checkType(value, ['string'], 'recipientAddress');
    this._recipientAddress = value;
  }

  get status() {
    return this._status;
  }

  set status(value) {
    this.checkInstanceOf(value, Status, 'status');
    this._status = value;
  }

  get itemizeState() {
    return this._itemizeState;
  }

  set itemizeState(value) {
    this.checkType(value, ['boolean'], 'itemizeState');
    this._itemizeState = value;
  }

  get date() {
    return this._date;
  }

  set date(value) {
    this.checkIsMoment(value, 'date');
    this._date = value;
  }

  get activityIds() {
    return this._activityIds;
  }

  set activityIds(value) {
    this._activityIds = value;
  }

  /**
   * Determina si la entidad recibe fondos o no.
   */
  get canReceiveFunds() {
    return this.isActive;
  }
}