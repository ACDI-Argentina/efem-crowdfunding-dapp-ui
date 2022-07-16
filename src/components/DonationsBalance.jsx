import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import makeSelectDonationsBalance from '../redux/selectors/donationsBalanceSelector'
import { connect } from 'react-redux'
import TokenBalance from './TokenBalance';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import FiatAmount from './FiatAmount'
import FiatTargetProgress from './FiatTargetProgress';
import { fetchDonationsByIds } from '../redux/reducers/donationsSlice'
import { red } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';

class DonationsBalance extends Component {

  constructor() {
    super();
  }

  componentDidMount() {
    this.props.fetchDonationsByIds(this.props.donationIds);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (JSON.stringify(this.props.donationIds) !== JSON.stringify(prevProps.donationIds)) {
      this.props.fetchDonationsByIds(this.props.donationIds);
    }
  }

  render() {
    const { balances, fiatTarget, donationIds, classes, t } = this.props;
    const donationsCount = donationIds.length;

    return (
      <Card className={classes.root}>
        <CardHeader
          className={classes.header}
          title={
            <FiatAmount amount={balances.fiatTotalBalance}></FiatAmount>
          }
          subheader={
            <Typography variant="body2">
              {t('donationsBalance')}
            </Typography>
          }>
        </CardHeader>
        <CardContent className={classes.content}>

          <ListItem alignItems="flex-start" className={classes.donationsCount}>
            <ListItemAvatar>
              <Avatar className={classes.donationsCountAvatar}>
                <FavoriteIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle2">
                  {t('donations')}
                </Typography>
              }
              secondary={
                <Typography variant="body2">
                  {donationsCount}
                </Typography>
              }
            />
          </ListItem>

          <Divider />

          {balances.tokenBalances.map(b => (
            <TokenBalance
              key={b.tokenAddress}
              tokenAddress={b.tokenAddress}
              balance={b.tokenBalance}>
            </TokenBalance>
          ))}

          <Divider />

          {fiatTarget && (
            <FiatTargetProgress
              fiatBalance={balances.fiatTotalBalance}
              fiatTarget={fiatTarget}>
            </FiatTargetProgress>
          )}
        </CardContent>
      </Card >
    );
  }
}

DonationsBalance.propTypes = {

};

DonationsBalance.defaultProps = {

};

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  header: {
    paddingBottom: '0px'
  },
  content: {
    paddingTop: '0px'
  },
  donationsCount: {
    padding: '0px'
  },
  donationsCountAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    color: red[500],
    backgroundColor: 'transparent'
  },
});

const makeMapStateToProps = () => {
  const selectDonationsBalance = makeSelectDonationsBalance()
  const mapStateToProps = (state, ownProps) => {
    return {
      balances: selectDonationsBalance(state, ownProps.donationIds)
    };
  }
  return mapStateToProps
}

const mapDispatchToProps = { fetchDonationsByIds }

export default connect(makeMapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(DonationsBalance)
  )
);