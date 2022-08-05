import { ipfsService } from 'commons';
import Item from '../models/Item';

/**
 * Conector encargado de subir y descargar contenido de Item con IPFS.
 * 
 */
class ItemIpfsConnector {

  /**
   * Realiza el upload del item a IPFS.
   * 
   * @param item a subir a IPFS
   * @return CID del item en IPFS
   */
  async upload(item) {
    // Se almacena en IPFS la imagen del Item.
    let imageCid = await ipfsService.upload(item.image);
    item.imageCid = imageCid;
    let itemCid = await ipfsService.upload(item.toIpfs());
    return itemCid;
  }

  /**
   * Descarga la información almacenada del Item en IPFS.
   * 
   * @param infoCid CID del Item
   * @return Item conformado por la información en IPFS.
   */
  async download(infoCid) {
    const { date, description, imageCid } = await ipfsService.downloadJson(infoCid);
    let item = new Item({
      date: date,
      description: description,
      imageCid: imageCid
    });
    return item;
  }
}

export default new ItemIpfsConnector();
