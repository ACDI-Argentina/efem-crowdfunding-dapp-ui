import { feathersClient } from '../lib/feathersClient';
import ErrorPopup from '../components/ErrorPopup';
import ipfsService from '../ipfs/IpfsService';
import crowdfundingContractApi from '../lib/blockchain/CrowdfundingContractApi';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js';
import User from '../models/User';
import { ALL_ROLES } from '../constants/Role';
import messageUtils from '../redux/utils/messageUtils'

class UserService {

  /**
   * Carga el usuario actual con los siguientes datos.
   * - Address según wallet
   * - Balance según wallet
   * - Datos identificatorios
   * - Roles. 
   * 
   * @param currentUser usuario actual
   */
  loadCurrentUser(currentUser) {

    return new Observable(async subscriber => {

      try {

        let address = currentUser.address;

        if (address) {

          feathersClient.service('/users').get(address).then(data => {
            const { name, email, avatar, url } = data;
            currentUser.registered = true;
            currentUser.name = name;
            currentUser.email = email;
            currentUser.avatar = avatar;
            currentUser.url = url;
            subscriber.next(currentUser);
          }).catch(err => {
            console.log('Error obteniendo datos del usuario desde Feathers:', err.message);
            if (err.code === 404) {
              currentUser.registered = false;
              currentUser.name = undefined;
              currentUser.email = undefined;
              currentUser.avatar = undefined;
              currentUser.url = undefined;
              subscriber.next(currentUser);
              return;
            }
          });

          // Se cargan los roles del usuario desde el smart constract
          getRoles(address).then(roles => {
            currentUser.roles = roles;
            subscriber.next(currentUser);
          });

          authenticateFeathers(currentUser).then(authenticated => {
            currentUser.authenticated = authenticated;
            subscriber.next(currentUser);
          });
        }
      } catch (err) {
        console.error('Error obteniendo datos del usuario.', err);
        subscriber.error(err);
      }
    });
  }

  /**
   * Carga el usuario coincidente con la address.
   * 
   * @param address del usuario.
   */
  loadUserByAddress(address) {
    return new Observable(async subscriber => {
      try {
        const userdata = await feathersClient.service('/users').get(address);
        // El usuario se encuentra registrado.
        userdata.registered = true;
        subscriber.next(new User({ ...userdata }));
      } catch (e) {
        console.error(`Error obteniendo usuario por address ${address}.`, e);
        if (e.name === 'NotFound') {
          // El usuario no está registrado.
          subscriber.next(new User({ address: address }));
        } else {
          subscriber.error(e);
        }
      }
    });
  }

  /**
   * Carga los usuarios con sus roles.
   * 
   * TODO Esto deberíamos obtimizarlo porque se están cargadno todos los usuarios
   * al mismo tiempo y cuando crezca la cantidad habrá problemas de performance.
   */
  loadUsersWithRoles() {
    return new Observable(async subscriber => {
      const usersByGroups = [];
      const { data: users } = await feathersClient.service("users").find();
      for (const user of users) {
        const roles = await getRoles(user.address);
        usersByGroups.push(new User({ ...user, roles }));
      }
      subscriber.next(usersByGroups);
    })
  }

  /**
   * Save new user profile to the blockchain or update existing one in feathers
   * Al usuario lo está guardando en mongodb con feathers, no en la blockchain!
   * Lo bueno con ipfs es que podriamos guardar mas datos
   *
   * @param user        User object to be saved
   * @param afterSave   Callback to be triggered after the user is saved in feathers
   */
  save(user) {
    return new Observable(async subscriber => {
      
      try {

        await this._updateAvatar(user);

        await _uploadUserToIPFS(user);

        await feathersClient.service('/users').patch(user.address, user.toFeathers());
        //user.isRegistered = true;
        user.registered = true;
        
        subscriber.next(user);
        messageUtils.addMessageSuccess({
          title: 'Felicitaciones!',
          text: `Su perfil ha sido registrado`
        });

      } catch (err) {
        subscriber.error(err);
        messageUtils.addMessageError({
          text: `Se produjo un error registrando su perfil. Por favor, refresque la página e inténtelo nuevamente.`,
          error: err
        });
      }
    });
  }

  async _updateAvatar(user) {
    if (user._newAvatar) {
      const avatarUrl = await ipfsService.upload(user._newAvatar);
      user.avatar = ipfsService.resolveUrl(avatarUrl);
      delete user._newAvatar;
    }
  }
}

async function authenticateFeathers(user) {
  let authenticated = false;
  if (user) {
    const token = await feathersClient.passport.getJWT();

    if (token) {
      const { userId } = await feathersClient.passport.verifyJWT(token);

      if (user.address === userId) {
        await feathersClient.authenticate(); // authenticate the socket connection
        authenticated = true;
      } else {
        await feathersClient.logout();
      }
    }
  }
  return authenticated;
}

async function _uploadUserToIPFS(user) {
  try {
    user.profileHash = await ipfsService.upload(user.toIpfs());
  } catch (err) {
    ErrorPopup('Failed to upload profile to ipfs');
  }
}

async function getRoles(address) {
  const userRoles = [];
  try {
    for (const rol of ALL_ROLES) {
      const canPerform = await crowdfundingContractApi.canPerformRole(address, rol);
      if (canPerform) userRoles.push(rol);
    }
  } catch (err) {
    console.error(`Error obteniendo roles del usuario ${address}.`, err);
  }
  return userRoles;
}

const pause = (ms = 3000) => {
  return new Promise((resolve, reject) => {
    setTimeout(_ => resolve(), ms)
  });
}

export default UserService;