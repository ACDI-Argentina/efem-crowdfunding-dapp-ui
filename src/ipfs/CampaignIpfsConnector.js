import { ipfsService } from 'commons';

/**
 * Conector encargado de subir y descargar contenido de Campaign con IPFS.
 * 
 */
class CampaignIpfsConnector {

  /**
   * Realiza el upload de la campaign a IPFS.
   * 
   * @param campaign a subir a IPFS
   * @return CID de la campaign en IPFS
   */
  async upload(campaign) {
    if (campaign.image) {
      // Se almacena en IPFS la imagen de la Campaign.
      let imageCid = await ipfsService.upload(campaign.image);
      campaign.imageCid = imageCid;
    }
    // Se almacena en IPFS toda la información de la Campaign.
    let infoCid = await ipfsService.upload(campaign.toIpfs());
    return infoCid;
  }

  /**
   * Descarga la información almacenada de la Campaign en IPFS.
   * 
   * @param infoCid CID del Campaign
   * @return información parcial de la Campaign en IPFS.
   */
  async download(infoCid) {
    return await ipfsService.downloadJson(infoCid);
  }
}

export default new CampaignIpfsConnector();