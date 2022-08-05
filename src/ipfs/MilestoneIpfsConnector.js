import { ipfsService } from 'commons';

/**
 * Conector encargado de subir y descargar contenido de Milestone con IPFS.
 * 
 */
class MilestoneIpfsConnector {

  /**
   * Realiza el upload del milestone a IPFS.
   * 
   * @param milestone a subir a IPFS
   * @return CID del milestone en IPFS
   */
  async upload(milestone) {
    if (milestone.image) {
      // Se almacena en IPFS la imagen del Milestone.
      let imageCid = await ipfsService.upload(milestone.image);
      milestone.imageCid = imageCid;
    }
    // Se almacena en IPFS toda la información del Milestone.
    let infoCid = await ipfsService.upload(milestone.toIpfs());
    return infoCid;
  }

  /**
   * Descarga la información almacenada del Milestone en IPFS.
   * 
   * @param infoCid CID del Milestone
   * @return información parcial del Milestone en IPFS.
   */
  async download(infoCid) {
    return await ipfsService.downloadJson(infoCid);
  }
}

export default new MilestoneIpfsConnector();