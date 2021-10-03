import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';

import { feathersClient } from '../lib/feathersClient';

const Context = createContext();
const { Provider, Consumer } = Context;
export { Consumer };

/**
 * check if the currentUser is in a particular whitelist.
 *
 * @param currentUser {object} Current User object
 * @param whitelist   {array}  Array of whitelisted addresses
 *
 * @return boolean
 *
 */
/**
 * TODO:EFEM
 * A esto deberiamos cambiarlo por una consulta a la blockchain rsk, 
 * en particular al smart contract de aragon app, preguntando sobre los roles que tiene una determina address 
 * No se todavía si usa la lista en alguna parte, o simplemente utiliza la siguiente funcion.
 * Como son funciones de view, no deberian tener costo alguno, pero no se en cuanto tiempo se ejecutan
 */
function isInWhitelist(currentUser, whitelist) {
  if (
    (Array.isArray(whitelist) && whitelist.length === 0) ||
    (Array.isArray(whitelist) &&
      currentUser &&
      currentUser.address &&
      whitelist.find(u => u.address.toLowerCase() === currentUser.address.toLowerCase()))
  ) {
    return true;
  }
  return false;
}

/**
 * Given list of addresses return users as pair of {address, title}. If no list is provided, return all users
 *
 * @param  {array} addresses List of addresses for which the users should be retrieved or undefined
 * @return {array}           List of users as pairs {address, title}
 */
async function getUsers(addresses) {
  const query = { $select: ['_id', 'name', 'address'] };

  if (Array.isArray(addresses) && addresses.length > 0)
    query.address = { $in: addresses.map(a => a.address) };
  else query.email = { $exists: true };

  const resp = await feathersClient.service('/users').find({ query });

  return resp.data.map(r => ({
    value: r.address,
    title: `${r.name ? r.name : 'Anonymous user'} - ${r.address}`,
  }));
}

/**
 * WhiteList stores all the whitelist global data
 *
 * @prop children    Child REACT components
 */
class WhiteListProvider extends Component {
  constructor() {
    super();

    this.state = {
      tokenWhitelist: [],
      fiatWhitelist: [],
      hasError: false,
    };
  }

  async componentDidMount() {
    try {
      const whitelist = await feathersClient.service('whitelist').find();

      this.setState({ ...whitelist },
        () => this.props.onLoaded(),
      );
    } catch (err) {
      console.error(err);
      this.setState({ hasError: true }, () => this.props.onLoaded());
    }
  }

  render() {
    const {
      tokenWhitelist,
      fiatWhitelist,
      hasError,
    } = this.state;

    return (
      <Provider
        value={{
          tokenWhitelist,
          fiatWhitelist,
          hasError,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

WhiteListProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  onLoaded: PropTypes.func.isRequired,
};

export default WhiteListProvider;
