import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import makeSelectDonationsBalance from '../redux/selectors/donationsBalanceSelector'
import { connect } from 'react-redux'
import { fetchDonationsByIds } from '../redux/reducers/donationsSlice'
import FiatTargetProgressCircular from './FiatTargetProgressCircular';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class SupportEntity extends Component {

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
    const { title, balances, fiatTarget, donationIds, donateButton, classes, t } = this.props;
    const donationsCount = donationIds.length;
    return (
      <div className={classes.root}>
        <Grid container
          spacing={2}
          direction="row">
          <Grid item xs={12} className={classes.center}>
            <Typography variant="subtitle2">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FiatTargetProgressCircular
              fiatBalance={balances.fiatTotalBalance}
              fiatTarget={fiatTarget}>
            </FiatTargetProgressCircular>
          </Grid>
          <Grid item xs={12} className={classes.center}>
            {donateButton}
          </Grid>
        </Grid>
      </div>
    );
  }
}

SupportEntity.propTypes = {

};

SupportEntity.defaultProps = {

};

const styles = theme => ({
  root: {
    padding: '1em',
  },
  center: {
    textAlign: 'center'
  }
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
    withTranslation()(SupportEntity)
  )
);