import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import config from '../configuration';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import ipfsService from '../ipfs/IpfsService';
import CryptoAmount from './CryptoAmount';

class TokenBalance extends Component {

  render() {
    const { tokenAddress, balance, classes, t } = this.props;
    let tokenConfig = config.tokens[tokenAddress];
    let symbol = tokenConfig.symbol;
    let logo = ipfsService.resolveUrl(tokenConfig.logoCid);

    return (
      <ListItem alignItems="flex-start" className={classes.root}>
        <ListItemAvatar>
          <Avatar alt={symbol} src={logo} className={classes.logo} />
        </ListItemAvatar>
        <ListItemText
          primary={symbol}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {t('tokenBalance')}&nbsp;
              </Typography>
              <CryptoAmount
                tokenAddress={tokenAddress}
                amount={balance}>
              </CryptoAmount>
            </React.Fragment>
          }
        />
      </ListItem>
    );
  }
}

TokenBalance.propTypes = {
  tokenAddress: PropTypes.string.isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired
};

TokenBalance.defaultProps = {
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
    width: theme.spacing(6),
    height: theme.spacing(6),
  }
});

export default withStyles(styles)(
  withTranslation()(TokenBalance)
);
