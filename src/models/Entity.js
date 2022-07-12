import { nanoid } from '@reduxjs/toolkit'
import Model from './Model';
import { cleanIpfsPath } from '../lib/helpers';
import ipfsService from '../ipfs/IpfsService';

/**
 * Base de DAC, Milestone y Campaign.
 */
class Entity extends Model {

  constructor({
    id,
    clientId = nanoid(),
    title = '',
    description = '',
    url = '',
    image = '',
    // https://gateway.pinata.cloud/ipfs/QmVedKPUTUcNpj6iUWyuEh9yVstBpNjMaL41KmMWF2bAuA
    imageCid = '/ipfs/QmVedKPUTUcNpj6iUWyuEh9yVstBpNjMaL41KmMWF2bAuA',
    donationIds = [],
    budgetDonationIds = [],
    createdAt,
  } = {}) {
    super();

    this._id = id;
    // ID utilizado solamente del lado cliente
    this._clientId = clientId;
    this._title = title;
    this._description = description;
    this._url = url;
    this._image = image;
    this._imageCid = imageCid;
    this._donationIds = donationIds;
    this._budgetDonationIds = budgetDonationIds;
    this._createdAt = createdAt;
  }

  /**
   * Obtiene un objeto plano para envíar a IPFS.
   */
  toIpfs() {
    return {
      title: this._title,
      description: this._description,
      url: this._url,
      imageCid: cleanIpfsPath(this._imageCid)
    }
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      id: this._id,
      clientId: this._clientId,
      title: this._title,
      description: this._description,
      url: this._url,
      imageCid: this._imageCid,
      donationIds: this._donationIds,
      budgetDonationIds: this._budgetDonationIds,
      createdAt: this._createdAt
    }
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this.checkType(value, ['undefined', 'number'], 'id');
    this._id = value;
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this.checkType(value, ['undefined', 'string'], 'clientId');
    this._clientId = value;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this.checkType(value, ['string'], 'title');
    this._title = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this.checkType(value, ['string'], 'description');
    this._description = value;
  }

  get url() {
    return this._url;
  }

  set url(value) {
    this.checkType(value, ['undefined', 'string'], 'url');
    this._url = value;
  }

  get image() {
    return this._image;
  }

  set image(value) {
    this._image = value;
  }

  get imageCid() {
    return this._imageCid;
  }

  set imageCid(value) {
    this.checkType(value, ['string'], 'imageCid');
    this._imageCid = value;
  }

  /**
   * Obtiene la URL completa de la imagen.
   */
  get imageCidUrl() {
    return ipfsService.resolveUrl(this._imageCid)
  }

  get txHash() {
    return this._txHash;
  }

  set txHash(value) {
    this.checkType(value, ['undefined', 'string'], 'txHash');
    this._txHash = value;
  }

  get donationIds() {
    return this._donationIds;
  }

  set donationIds(value) {
    this._donationIds = value;
  }

  get budgetDonationIds() {
    return this._budgetDonationIds;
  }

  set budgetDonationIds(value) {
    this._budgetDonationIds = value;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    this._createdAt = value;
  }

  /**
   * Obtiene la cantidad de donaciones a la entidad.
   */
  get donationsCount() {
    return this._donationIds.length;
  }

  /**
   * Obtiene la cantidad de donaciones en el presupuesto de la entidad.
   */
  get budgetDonationsCount() {
    return this._budgetDonationIds.length;
  }
}

export default Entity;
