import { nanoid } from '@reduxjs/toolkit'
import moment from 'moment';
import Model from './Model';
import { cleanIpfsPath, getStartOfDayUTC } from '../lib/helpers';
import { ipfsService } from '@acdi/efem-dapp';

class Item extends Model {

  constructor(data) {
    super(data);
    const {
      clientId = nanoid(),
      date = getStartOfDayUTC().subtract(1, 'd'),
      description = '',
      image = '',
      imageCid = ''
    } = data;
    this._clientId = clientId;
    this._date = date;
    this._description = description;
    this._image = image;
    this._imageCid = imageCid;
  }

  toIpfs() {
    return {
      date: this._date,
      description: this._description,
      imageCid: cleanIpfsPath(this._imageCid)
    };
  }

  /**
   * Obtiene un objeto plano para ser almacenado.
   */
  toStore() {
    return {
      clientId: this._clientId,
      date: this._date,
      description: this._description,
      imageCid: this._imageCid
    }
  }

  get clientId() {
    return this._clientId;
  }

  set clientId(value) {
    this.checkType(value, ['undefined', 'string'], 'clientId');
    this._clientId = value;
  }

  get date() {
    return this._date;
  }

  set date(value) {
    if (moment(value).isAfter(moment(getStartOfDayUTC().subtract(1, 'd')))) {
      throw new TypeError(`Item date should be before today`);
    } else {
      this._date = value;
    }
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this.checkType(value, ['string'], 'description');
    this._description = value;
  }

  set image(value) {
    if (value || this._newImage !== value) {
      this._newImage = true;
    }
    this._image = value;
  }

  get image() {
    return this._image;
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

  get imageSrc() {
    if(this._image && this._image != '') {
      return this._image;
    } else {
      return this.imageCidUrl;
    }
  }
}

export default Item;