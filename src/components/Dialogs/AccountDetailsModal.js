import React, { useContext } from 'react';

import styled from 'styled-components';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';


import { Web3AppContext } from 'lib/blockchain/Web3App';

import BalancesInfo from './BalancesInfo';
import AccountInfo from './AccountInfo';
import ModalHeader from './ModalHeader';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '1em',
  },
}));


const Footer = styled.div`
  padding: 10px;
`;


const Button = styled.button`
  padding: 0.2em 1em;
  border-radius: 1em;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  border: 1px solid transparent;
`;

const LogoutButton = styled(Button)`
  color: white;
  background-color: #ff5d49;
  font-weight: bold;
  font-size: 1.1em;
`;


// TODO: hacer que el modal lea el address del store tambien
const AccountDetailsModal = ({ address, onClose, ...props }) => {
  const { logoutAccount } = useContext(Web3AppContext);

  const title = 'Your wallet'; 
  const classes = useStyles();
  if (!address) {
    return null;
  }

  return (
    <Dialog onClose={onClose} TransitionComponent={Transition} {...props}>
      <ModalHeader 
        title={title}
        onClose={onClose}
        />
      <div className={classes.root}>
        <Grid container spacing={3}>
          <AccountInfo address={address}/>
          <BalancesInfo />
          <Grid container item justify="center" xs={12}>
            <Footer>
              <LogoutButton
                onClick={() => {
                  logoutAccount();
                  onClose();
                }}
              >
                Logout
              </LogoutButton>
            </Footer>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
};
export default AccountDetailsModal;
