import { ipfsService } from 'commons';

/**
 * Conector encargado de subir y descargar contenido de Dac con IPFS.
 * 
 */
class DacIpfsConnector {

  /**
   * Realiza el upload de la dac a IPFS.
   * 
   * @param dac a subir a IPFS
   * @return CID de la dac en IPFS
   */
  async upload(dac) {
    if (dac.image) {
      // Se almacena en IPFS la imagen de la Dac.
      let imageCid = await ipfsService.upload(dac.image);
      dac.imageCid = imageCid;
    }
    // Se almacena en IPFS toda la información de la Dac.
    let infoCid = await ipfsService.upload(dac.toIpfs());
    return infoCid;
  }

  /**
   * Descarga la información almacenada de la Dac en IPFS.
   * 
   * @param infoCid CID del Dac
   * @return información parcial de la Dac en IPFS.
   */
  async download(infoCid) {
    return await ipfsService.downloadJson(infoCid);
  }
}

export default new DacIpfsConnector();