import { store } from '../store';
import { selectRoles } from '../reducers/rolesSlice';

/**
 * Clase utilitaria para el manejo de roles a través de Redux.
 */
class RoleUtils {

  /**
   * Obtiene todos los roles.
   */
  getRoles() {
    return selectRoles(store.getState());
  }
}

export default new RoleUtils();