import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import config from '../configuration';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import CryptoAmount from './CryptoAmount';
import TokenUtils from 'utils/TokenUtils';
import TokenAvatar from './TokenAvatar';

class TokenBalance extends Component {

  render() {
    const { tokenAddress, balance, classes, t } = this.props;
    let tokenConfig = TokenUtils.getTokenConfig(tokenAddress);
    let symbol = tokenConfig.symbol;

    return (
      <ListItem alignItems="flex-start" className={classes.root}>
        <ListItemAvatar>
          <TokenAvatar tokenAddress={tokenAddress} />
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
  }
});

export default withStyles(styles)(
  withTranslation()(TokenBalance)
);
