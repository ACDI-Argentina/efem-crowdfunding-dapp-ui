import React, { useContext, useState } from 'react';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import { useSelector } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { web3Utils } from 'commons';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//import { history } from '../lib/helpers';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import RoundedButton from './buttons/RoundedButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { OnlyRole, history } from '@acdi/efem-dapp';
import {
  CREATE_DAC_ROLE
} from 'constants/Role';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { selectDac } from 'redux/reducers/dacsSlice';
import config from 'configuration';

const useStyles = makeStyles({
  walletIcon: {
    height: '100%',
    marginTop: '-0.4em'
  }
});

const ConnectButton = (props) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const classes = useStyles();
  const { t } = props;
  const {
    loginAccount,
    logoutAccount,
    network,
    web3,
  } = useContext(Web3AppContext);
  const currentUser = useSelector(selectCurrentUser);
  const dac = useSelector(state => selectDac(state, config.dac.defaultId));

  const isUserConnected = currentUser?.address || false;
  const isUserRegistered = currentUser?.registered || false;
  const isCorrectNetwork = network?.isCorrect || false;

  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleClickProfile = () => {
    history.push(`/profile`);
  };

  const handleClickDacNew = () => {
    history.push(`/dacs/new`);
  };

  const handleClickDacView = () => {
    history.push(`/dacs/${config.dac.defaultId}`);
  };

  const handleClickLogout = () => {
    logoutAccount();
    setMenuAnchorEl(null);
  };

  return (
    <React.Fragment>

      {!isUserConnected && (
        <RoundedButton
          style={{ width: '15em' }}
          onClick={() => loginAccount()}>
          {t('connectWallet')}
        </RoundedButton>
      )}

      {isUserConnected && (
        <RoundedButton
          color={isCorrectNetwork ? "success" : "warning"}
          style={{ width: '15em' }}
          onClick={handleOpenMenu}
          startIcon={
            web3.wallet ?
              <Icon className={classes.walletIcon}>
                <img src={web3.wallet.logo}
                  style={{ width: '100%' }}
                  alt="connect" />
              </Icon> :
              <AccountBalanceWalletIcon />
          }
          endIcon={
            menuAnchorEl ?
              <ExpandLessIcon></ExpandLessIcon> :
              <ExpandMoreIcon></ExpandMoreIcon>
          }>
          {web3Utils.abbreviateAddress(currentUser?.address)}
        </RoundedButton>
      )}

      <Menu
        id="menu"
        anchorEl={menuAnchorEl}
        keepMounted
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={
          handleClickProfile
        }>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary={isUserRegistered ? t('menuProfile') : t('menuSignup')} />
        </MenuItem>
        {!dac &&
          <OnlyRole user={currentUser} role={CREATE_DAC_ROLE}>
            <MenuItem onClick={
              handleClickDacNew
            }>
              <ListItemIcon>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText primary={t('dacNew')} />
            </MenuItem>
          </OnlyRole>
        }
        {dac &&
          <MenuItem onClick={
            handleClickDacView
          }>
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary={t('dacView')} />
          </MenuItem>
        }
        <MenuItem onClick={
          handleClickLogout
        }>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={t('logoutTitle')} />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default withTranslation()(ConnectButton);