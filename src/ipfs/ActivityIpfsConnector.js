import { ipfsService } from 'commons';
import itemIpfsConnector from './ItemIpfsConnector';

/**
 * Conector encargado de subir y descargar contenido de Activity con IPFS.
 * 
 */
class ActivityIpfsConnector {

  /**
   * Realiza el upload del activity a IPFS.
   * 
   * @param activity a subir a IPFS
   * @return CID del activity en IPFS
   */
  async upload(activity) {
    // Subir items a IPFS.
    let itemCids = [];
    for (let i = 0; i < activity.items.length; i++) {
      let itemCid = await itemIpfsConnector.upload(activity.items[i]);
      itemCids.push(itemCid);
    }
    activity.itemCids = itemCids;
    // Se almacena en IPFS toda la información del Activity.
    let activityCid = await ipfsService.upload(activity.toIpfs());
    return activityCid;
  }

  /**
   * Descarga la información almacenada del Activity en IPFS.
   * 
   * @param infoCid CID del Activity
   * @return información parcial del activity en IPFS.
   */
  async download(infoCid) {
    const { action, message, itemCids } = await ipfsService.downloadJson(infoCid);
    let items = [];
    for (let i = 0; i < itemCids.length; i++) {
      let item = await itemIpfsConnector.download(itemCids[i]);
      items.push(item);
    }
    return { action, message, items };
  }
}

export default new ActivityIpfsConnector();