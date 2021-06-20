import { nanoid } from '@reduxjs/toolkit'
import Model from './Model';
import Item from './Item';
import moment from 'moment';

/**
 * Modelo de actividad de un milestone en la Dapp.
 */
class Activity extends Model {

  constructor(data = {}) {
    super(data);
    const {
      id,
      clientId = nanoid(),
      milestoneId,
      userAddress = '',
      createdAt = moment().unix(),
      action = '',
      message = '',
      items = []
    } = data;

    this._id = id;
    // ID utilizado solamente del lado cliente
    this._clientId = clientId;
    this._milestoneId = milestoneId;
    this._userAddress = userAddress;
    this._createdAt = createdAt;
    this._action = action;
    this._message = message;
    this._items = items;
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      id: this._id,
      clientId: this._clientId,
      milestoneId: this._milestoneId,
      userAddress: this._userAddress,
      createdAt: this._createdAt,
      action: this._action,
      message: this._message,
      items: this._items
    };
  }

  /**
   * Obtiene un objeto plano para envíar a IPFS.
   */
  toIpfs() {
    return {
      action: this._action,
      message: this._message,
      itemCids: this._itemCids
    }
  }

  get isApprove() {
    return this._action === Activity.ACTION_APPROVE;
  }

  get isReject() {
    return this._action === Activity.ACTION_REJECT;
  }

  get hasItems() {
    return this._items.length > 0;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this.checkType(value, ['number'], 'id');
    this._id = value;
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this.checkType(value, ['undefined', 'string'], 'clientId');
    this._clientId = value;
  }

  get userAddress() {
    return this._userAddress;
  }

  set userAddress(value) {
    this.checkType(value, ['string'], 'userAddress');
    this._userAddress = value;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    this.checkType(value, ['string'], 'createdAt');
    this._createdAt = value;
  }

  get milestoneId() {
    return this._milestoneId;
  }

  set milestoneId(value) {
    this.checkType(value, ['number'], 'milestoneId');
    this._milestoneId = value;
  }

  get action() {
    return this._action;
  }

  set action(value) {
    this.checkType(value, ['string'], 'action');
    this._action = value;
  }

  get message() {
    return this._message;
  }

  set message(value) {
    this.checkType(value, ['string'], 'message');
    this._message = value;
  }

  get items() {
    return this._items;
  }

  set items(value) {
    value.forEach(item => {
      this.checkInstanceOf(item, Item, 'items');
    });
    this._items = value;
  }

  set itemCids(value) {
    this._itemCids = value;
  }

  get itemCids() {
    return this._itemCids;
  }

  static get ACTION_COMPLETE() {
    return 'Complete';
  }

  static get ACTION_APPROVE() {
    return 'Approve';
  }

  static get ACTION_REJECT() {
    return 'Reject';
  }

  static get ACTION_CANCEL() {
    return 'Cancel';
  }
}

export default Activity;
