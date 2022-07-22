import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DateTimeViewer from './DateTimeViewer';
import Divider from '@material-ui/core/Divider';
import { withTranslation } from 'react-i18next';
import ProfileCardMini from './ProfileCardMini';
import CryptoAmount from './CryptoAmount';
import StatusIndicator from './StatusIndicator';
import { connect } from 'react-redux'
import { selectDonation } from '../redux/reducers/donationsSlice'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import makeEntitySelect from '../redux/selectors/entitiesSelector';
import TokenUtils from 'utils/TokenUtils';
import TokenAvatar from './TokenAvatar';

class DonationItem extends Component {

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    const { donation, entity, classes, t } = this.props;

    if (!donation) {
      // TODO Implementar un Skeletor (https://material-ui.com/components/skeleton/) cuando no esté en Labs.
      return (<div></div>)
    }

    return (
      <div className={classes.root}>
        <Grid container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          onClick={this.handleClick}
          spacing={2}>

          <Grid item xs={4}>
            <ProfileCardMini address={donation.giverAddress} />
          </Grid>

          <Grid item xs={8}>
            <Grid container spacing={1}>

              <Grid item xs={1}>
                <TokenAvatar tokenAddress={donation.tokenAddress}></TokenAvatar>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h6">
                  <CryptoAmount amount={donation.amountRemainding} tokenAddress={donation.tokenAddress} />
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <StatusIndicator status={donation.status}></StatusIndicator>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  <DateTimeViewer value={donation.createdAt} />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  {t('donationInitial', {
                    amount: TokenUtils.format(donation.tokenAddress, donation.amount),
                    entity: entity.title
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
      </div>
    );
  }
}


const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    padding: '1em 0px 1em 0px'
  },
  text: {
    marginLeft: '2em'
  },
  avatar: {
    width: '8em'
  }
});

DonationItem.propTypes = {
  donationId: PropTypes.number.isRequired
};

const makeMapStateToProps = () => {
  const entitySelect = makeEntitySelect()
  const mapStateToProps = (state, ownProps) => {
    let props = {}
    props.donation = selectDonation(state, ownProps.donationId);
    if (props.donation) {
      props.entity = entitySelect(state, props.donation.entityId);
    }
    return props;
  }
  return mapStateToProps
}

const mapDispatchToProps = {}

export default connect(makeMapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(DonationItem)
  )
);