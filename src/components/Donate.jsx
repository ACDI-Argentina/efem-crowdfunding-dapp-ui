import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Donation from '../models/Donation';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux'
import { addDonation } from '../redux/reducers/donationsSlice'
import User from 'models/User';
import TextField from '@material-ui/core/TextField';
import FavoriteIcon from '@material-ui/icons/Favorite';
import InputAdornment from '@material-ui/core/InputAdornment';
import config from '../configuration';
import TokenBalance from './TokenBalance';
import Web3Utils from '../lib/blockchain/Web3Utils';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import FiatAmountByToken from './FiatAmountByToken';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import ProfileCard from './ProfileCard';
import ProfilePopup from './ProfilePopup';

import { selectExchangeRateByToken } from '../redux/reducers/exchangeRatesSlice';
import { AppTransactionContext } from 'lib/blockchain/Web3App';

const ANONYMOUS_DONATION_THRESHOLD = config.anonymousDonationThreshold;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Donate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      showProfilePopup: false,
      amount: 0
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDonate = this.handleDonate.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleAmountBlur = this.handleAmountBlur.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  handleClickOpen() {
    const {currentUser} = this.props;
    if(currentUser.address){
      this.open();
    } else {
      this.context.initAccount()
          .then(() =>this.open())
          .catch(err => console.log(err));
    }
    
  };

  handleClose() {
    this.close();
  };

  handleAmountChange(event) {
    this.setState({
      amount: event.target.value === '' ? '' : Number(event.target.value)
    });
  };

  handleAmountBlur() {
    const { amount } = this.state;
    const { currentUser } = this.props;
    const max = Web3Utils.weiToEther(currentUser.balance);
    if (amount < 0) {
      this.setState({amount: 0,});
    } else if (amount > max) {
      this.setState({amount: max});
    }
  };

  handleDonate() {
    const { amount } = this.state;
    const { entityId, currentUser, tokenAddress, addDonation, rate } = this.props;
    
    const amountWei = Web3Utils.etherToWei(amount);
    const centsFiatAmount = amountWei.dividedBy(rate);
    const dollarsAmount = centsFiatAmount.dividedBy(100).toNumber();

    if(dollarsAmount > ANONYMOUS_DONATION_THRESHOLD && !currentUser.hasCompleteProfile()){ 
      this.setState({showProfilePopup:true})
    } else {
      const donation = new Donation();
      donation.entityId = entityId;
      donation.tokenAddress = tokenAddress;
      donation.amount = Web3Utils.etherToWei(amount);
      donation.giverAddress = currentUser.address;
      addDonation(donation);
      this.close(); 
    }
  };

  open() {
    this.setState({
      open: true
    });
  }

  close() {
    this.setState({
      open: false
    });
  }

  render() {
    const { open, amount, showProfilePopup } = this.state;
    const { title, description, entityCard, enabled, currentUser, classes, t, rate } = this.props;

    // TODO Definir parametrización de donación.
    const balance = currentUser.balance;

    const max = Web3Utils.weiToEther(balance);
    const inputProps = {
      step: 0.0001,
      min: 0,
      max: max,
      size: 31
    };

    let tokenConfig = config.tokens[this.props.tokenAddress];
    let tokenSymbol = tokenConfig.symbol;

    let donationIsValid = false;
    if (amount > 0) {
      donationIsValid = true;
    }
    let amountWei = Web3Utils.etherToWei(amount||0);
    return (
      <div>
        {enabled && (
          <OnlyCorrectNetwork>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<FavoriteIcon />}
              onClick={this.handleClickOpen}
            >
              {t('donate')}
            </Button>
          </OnlyCorrectNetwork>
        )}
        <Dialog fullWidth={true}
          maxWidth="md"
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {title}
              </Typography>
              <Button autoFocus
                color="inherit"
                onClick={this.handleDonate}
                disabled={!donationIsValid}>
                {t('donate')}
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item sm={5} xs={12}>
                {entityCard}
              </Grid>
              <Grid item sm={7} xs={12}>
                <Grid container>
                  <Typography variant="subtitle1" gutterBottom>
                    {description}
                  </Typography>
                  <ProfileCard address={currentUser.address} />
                  <TokenBalance balance={balance}></TokenBalance>
                  <TextField
                    id="donate-amount"
                    label={t('donateAmount')}
                    className={classes.amount}
                    type="number"
                    value={amount}
                    onChange={this.handleAmountChange}
                    onBlur={this.handleAmountBlur}
                    InputLabelProps={
                      {
                        shrink: true,
                      }
                    }
                    InputProps={
                      {
                        startAdornment: <InputAdornment position="start">{tokenSymbol}</InputAdornment>
                      }
                    }
                    inputProps={inputProps}
                  />
                  <FiatAmountByToken amount={amountWei}/>
                </Grid>
              </Grid>
            </Grid>
          </div>
        {showProfilePopup && 
            (
            <ProfilePopup 
              open={true}
              requireFullProfile={true}
              handleClose = {() => {this.setState({showProfilePopup:false})}}
              handleSubmit = {() => {this.setState({showProfilePopup:false})}}
             ></ProfilePopup> 
            )}
        </Dialog>

      </div >
    );
  }
}

Donate.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  tokenAddress: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
};

Donate.defaultProps = {
  tokenAddress: config.nativeToken.address,
  enabled: false
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '1em'
  },
  amount: {
    width: '100%',
    marginTop: '1em'
  },
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  button: {
    margin: theme.spacing(0.5),
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    rate: (selectExchangeRateByToken(state, ownProps.tokenAddress || config.nativeToken.address))?.rate
  }
}

const mapDispatchToProps = { addDonation }

Donate.contextType = AppTransactionContext;

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(Donate)
  )
);