import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
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

class DonationItem extends Component {

  constructor() {
    super();
    this.state = {
      activities: {},
      isLoading: false,
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    let open = !this.state.open;
    this.setState({
      open: open
    });
  };

  render() {
    const { user, open } = this.state;
    const { donation, entity, classes, t } = this.props;

    if (!donation) {
      // TODO Implementar un Skeletor (https://material-ui.com/components/skeleton/) cuando no esté en Labs.
      return (<div></div>)
    }

    return (
      <React.Fragment>
        <ListItem alignItems="flex-start" onClick={this.handleClick}>
          <ListItemAvatar className={classes.avatar}>
            <ProfileCardMini address={donation.giverAddress} namePosition="bottom" />
          </ListItemAvatar>
          <ListItemText
            className={classes.text}
            primary={
              <Grid container spacing={1}>
                <Grid item xs={9}>
                  <Typography variant="h6">
                    <CryptoAmount amount={donation.amountRemainding} tokenAddress={donation.tokenAddress} />
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <StatusIndicator status={donation.status}></StatusIndicator>
                </Grid>
              </Grid>
            }
            secondary={
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    <DateTimeViewer value={donation.createdAt} />
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    {t('donationInitial', {
                      amount: TokenUtils.format(donation.tokenAddress, donation.amount),
                      entity: entity.title
                    })}
                  </Typography>
                </Grid>
              </Grid>
            }
          />
        </ListItem>
        <Divider />
      </React.Fragment>
    );
  }
}


const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
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