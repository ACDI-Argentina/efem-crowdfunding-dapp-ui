import React, { Component } from 'react';
import classNames from "classnames";
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
import { User } from '@acdi/efem-dapp';
import TextField from '@material-ui/core/TextField';
import FavoriteIcon from '@material-ui/icons/Favorite';
import InputAdornment from '@material-ui/core/InputAdornment';
import config from '../configuration';
import TokenUserBalance from './TokenUserBalance';
import TokenAvatar from './TokenAvatar';
import { web3Utils } from 'commons';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import FiatAmountByToken from './FiatAmountByToken';
import ProfileCard from './ProfileCard';
import ProfilePopup from './ProfilePopup';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { selectExchangeRateByToken } from '../redux/reducers/exchangeRatesSlice';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import TokenUtils from 'utils/TokenUtils';
import { dropShadowButton } from 'assets/jss/material-kit-react/components/customButtonStyle';

const ANONYMOUS_DONATION_THRESHOLD = config.anonymousDonationThreshold;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Donate extends Component {

  constructor(props) {
    super(props);
    let tokenConfig = TokenUtils.getTokenConfig(config.nativeToken.address);
    this.state = {
      open: false,
      showProfilePopup: false,
      tokenAddress: tokenConfig.address,
      donateInputProps: {
        step: tokenConfig.donateStep,
        min: 0,
        max: web3Utils.weiToEther(props.currentUser.balance),
        size: 31
      },
      amount: 0
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDonate = this.handleDonate.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleAmountBlur = this.handleAmountBlur.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }


  componentDidUpdate(prevProps, prevState){
    const tokenAddress = this.state.tokenAddress;
    const balance = this.props.currentUser?.tokenBalances[tokenAddress];

    if(this.props.currentUser != prevProps.currentUser){
      balance && this.updateMax();
    }
    if(tokenAddress!= prevState.tokenAddress) {
      balance && this.updateMax();
    }
  }

  updateMax(){
    const { tokenAddress } = this.state;
    const balance = this.props.currentUser.tokenBalances[tokenAddress];
    const max = web3Utils.weiToEther(balance);
          
    this.setState(prev => ({
        donateInputProps: {
          ...prev.donateInputProps,
          max: max.toString()
        }
      }));
  }

  async handleClickOpen() {
    const { currentUser } = this.props;
    const { network, modals,loginAccount } = this.context;

    const isConnectedUser = currentUser.address;
    const isCorrectNetwork = network.isCorrect;

    
    if(isConnectedUser && isCorrectNetwork){ 
      this.open();
    } else if(!isCorrectNetwork){ 
      modals.methods.bounceNotification();
    } else {
      const connected = await loginAccount();
      if(connected){
        this.open();
      }
    }
    
  };

  handleClose() {
    this.close();
  };

  handleTokenChange = (event) => {

    let tokenAddress = event.target.value;
    let donateInputProps = this.state.donateInputProps;
    let tokenConfig = TokenUtils.getTokenConfig(tokenAddress);
    donateInputProps.step = tokenConfig.donateStep;

    this.setState({
      tokenAddress: tokenAddress,
      amount: 0,
      donateInputProps: donateInputProps
    });
  };

  handleAmountChange(event) {
    const value = event.target.value
    
    try{
      const parsed = Number(value.trim());
      if(!isNaN(parsed)){
        if(value.includes('.') && value.split('.').length === 2){
          //Check number of decimal places
          const decimalPlaces = value.split('.')[1].length;
          if(decimalPlaces > 18){ //Cae por fuera de lo que podamos manejar con wei
            return;
          }


        }

       return this.setState({amount:value});
      }
  
    } catch(err){
      console.log(err);
    }
    this.setState({amount:''});
    
  };

  handleAmountBlur() {
    const { amount, tokenAddress } = this.state;
    const { currentUser } = this.props;
    const max = web3Utils.weiToEther(currentUser.tokenBalances[tokenAddress]);
    if (amount < 0) {
      this.setState({ amount: 0 });
    } else if (amount > max) {
      this.setState({ amount: max });
    }
  };

  handleDonate() {
    const { tokenAddress, amount } = this.state;
    const { entityId, currentUser, addDonation, rate } = this.props;

    const amountWei = web3Utils.etherToWei(amount);
    const centsFiatAmount = amountWei.dividedBy(rate);
    const dollarsAmount = centsFiatAmount.dividedBy(100).toNumber();

    if (dollarsAmount > ANONYMOUS_DONATION_THRESHOLD && !currentUser.hasCompleteProfile()) {
      this.setState({ showProfilePopup: true })
    } else {
      const donation = new Donation();
      donation.entityId = entityId;
      donation.tokenAddress = tokenAddress;
      donation.amount = web3Utils.etherToWei(amount);
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
    const { open, tokenAddress, amount, donateInputProps, showProfilePopup } = this.state;
    const { title, description, entityCard, enabled, currentUser, classes, t } = this.props;

    let tokenSelectedSymbol = TokenUtils.getTokenConfig(tokenAddress).symbol;

    let donationIsValid = false;
    if (amount > 0) {
      donationIsValid = true;
    }


    let amountWei;
    try{
      amountWei = web3Utils.etherToWei(amount || 0);
    } catch(err){
      console.log(err);
      amountWei = 0;
    }
     

    let tokenOptions = Object.keys(config.tokens).map(tokenKey => 
      <MenuItem key={config.tokens[tokenKey].address}
          value={config.tokens[tokenKey].address}>
        <Grid container
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
            className={classes.selectToken}>
          <Grid item xs={5}>
            <TokenAvatar tokenAddress={config.tokens[tokenKey].address} />
          </Grid>
          <Grid item xs={7}>
            <Typography variant="inherit" noWrap>
              {config.tokens[tokenKey].symbol}
            </Typography>
          </Grid>
        </Grid>
      </MenuItem>
    );

    return (
      <div>
        {enabled && (
            <Button
              variant="contained"
              color="primary"
              size="md"
              className={classNames(classes.button, classes.dropShadowButton)}
              onClick={this.handleClickOpen}
            >
              {t('donate')}
            </Button>
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
                  <Grid container
                      spacing={2}
                      justifyContent="flex-start"
                      alignItems="center">
                    <Grid item xs={4}>
                      <Select value={tokenAddress} onChange={this.handleTokenChange} >
                        {tokenOptions}
                      </Select>
                    </Grid>
                    <Grid item xs={8}>
                      <TokenUserBalance tokenAddress={tokenAddress} />
                    </Grid>
                  </Grid>
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
                        startAdornment: <InputAdornment position="start">{tokenSelectedSymbol}</InputAdornment>
                      }
                    }
                    inputProps={donateInputProps}
                  />
                  <FiatAmountByToken tokenAddress={tokenAddress} amount={amountWei} />
                </Grid>
              </Grid>
            </Grid>
          </div>
          {showProfilePopup &&
            (
              <ProfilePopup
                open={true}
                requireFullProfile={true}
                handleClose={() => { this.setState({ showProfilePopup: false }) }}
                handleSubmit={() => { this.setState({ showProfilePopup: false }) }}
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
  },
  logo: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  selectToken: {
    width: '8em'
  },
  dropShadowButton: {
    ...dropShadowButton,
    margin: ".5em"
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    rate: (selectExchangeRateByToken(state, ownProps.tokenAddress || config.nativeToken.address))?.rate
  }
}

const mapDispatchToProps = { addDonation }

Donate.contextType = Web3AppContext;

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(Donate)
  )
);