import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Typography from '@material-ui/core/Typography'
import { withTranslation } from 'react-i18next'
import config from '../configuration'
import PropTypes from 'prop-types'
import CryptoAmount from './CryptoAmount'
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import { connect } from 'react-redux'
import TokenAvatar from './TokenAvatar'
import TokenUtils from 'utils/TokenUtils'
import BigNumber from 'bignumber.js';

class TokenUserBalance extends Component {

  render() {
    const { tokenAddress, currentUser, classes, t } = this.props;

    let tokenConfig = TokenUtils.getTokenConfig(tokenAddress);
    let symbol = tokenConfig.symbol;

    let balance = currentUser.balance;
    if(!tokenConfig.isNative) {
      balance = currentUser.tokenBalances[tokenAddress] || new BigNumber(0);
    }

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

TokenUserBalance.propTypes = {
  tokenAddress: PropTypes.string.isRequired
};

TokenUserBalance.defaultProps = {
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

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = {  }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(TokenUserBalance)
  )
);