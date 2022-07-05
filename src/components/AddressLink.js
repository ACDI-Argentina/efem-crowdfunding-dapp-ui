import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';
import config from '../configuration'
import { web3Utils } from 'commons';

class AddressLink extends Component {

    preventDefault = (event) => event.preventDefault();

    render() {
        const { address } = this.props;
        return (
            <Link href={config.network.explorer + 'address/' + address}
                onClick={this.preventDefault}
                target={"_blank"}>
                {web3Utils.abbreviateAddress(address)}
            </Link>
        );
    }
}

AddressLink.propTypes = {
    address: PropTypes.string
};

export default AddressLink;