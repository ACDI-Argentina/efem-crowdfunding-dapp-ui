import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { withTranslation } from 'react-i18next';
import config from '../configuration';
import PropTypes from 'prop-types';
import ipfsService from '../ipfs/IpfsService';
import TokenUtils from 'utils/TokenUtils';

class TokenAvatar extends Component {

  render() {
    const { tokenAddress, classes, t } = this.props;
    let tokenConfig = TokenUtils.getTokenConfig(tokenAddress);
    let symbol = tokenConfig.symbol;
    let logo = ipfsService.resolveUrl(tokenConfig.logoCid);

    return (
      <Avatar alt={symbol} src={logo} className={classes.logo} />
    );
  }
}

TokenAvatar.propTypes = {
  tokenAddress: PropTypes.string.isRequired
};

TokenAvatar.defaultProps = {
  tokenAddress: config.nativeToken.address
};

const styles = theme => ({
  root: {
    padding: '0px'
  },
  inline: {
    display: 'inline',
  },
  logo: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  }
});

export default withStyles(styles)(
  withTranslation()(TokenAvatar)
);