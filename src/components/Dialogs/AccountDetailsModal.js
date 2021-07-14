import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Grid, IconButton, Typography, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { Web3AppContext } from 'lib/blockchain/Web3App';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';

import config from '../../configuration';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '1em',
  },
  amount: {
    width: '100%',
    marginTop: '1em',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  button: {
    margin: theme.spacing(0.5),
  },
}));

const LinkButton = styled.a`
  color: #53a653;
  font-weight: bold;
  padding: 10px;
  :hover {
    text-decoration: underline;
    color: #53a653;
  }
`;
const Footer = styled.div`
  padding: 10px;
`;

const Address = styled.div`
  font-family: Rubik, sans-serif;
  font-weight: 400;
  font-size: 1.3em;
  padding: 1em;
  color: gray;
  word-break: break-all;
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

const CopyAddress = styled.div`
  font-weight: bold;
  cursor: pointer;
  padding: 10px;
  color: #53a653;
`;

const Row = styled.div`
  display:flex;
  flex-direction:row;
`

const Balance = styled.div`
   font-weight:bold;
   min-width:120px;
       
   justify-content: flex-end;
   display: flex;
   padding: 0px 10px;

`

// TODO: hacer que el modal lea el address del store tambien
const AccountDetailsModal = ({ address, onClose, ...props }) => {
  const currentUser = useSelector(selectCurrentUser);

  const title = 'Your wallet';
  const { web3, explorer, logoutAccount } = useContext(Web3AppContext);

  const classes = useStyles();

  console.log(currentUser.tokenBalances);

  const formatBalance = (balance, tokenSymbol) => {
    // BN instance
    const formattedBalance = parseFloat(web3.utils.fromWei(balance.toString()))?.toFixed(5);
    return formattedBalance;
  };

  const sanitizedExplorer = explorer?.endsWith('/') ? explorer?.slice(0, -1) : explorer;
  const explorerLink = `${sanitizedExplorer}/address/${address}`;

  const [showTooltip, setShowTooltip] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(address);
    // show popup copied!by a seconds
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1000);
  }

  if (!address) {
    return null;
  }

  return (
    <Dialog onClose={onClose} TransitionComponent={Transition} {...props}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid container item justify="center" xs={12}>
            <Address>{address}</Address>
          </Grid>
          <Grid container justify="center" align="center" item sm={4} xs={12}>
            <LinkButton target="_blank" href={explorerLink}>
              View on RSK explorer
            </LinkButton>
          </Grid>
          <Grid container justify="center" align="center" item sm={4} xs={12}>
            <Tooltip open={showTooltip} title="Copied!" placement="top">
              <CopyAddress onClick={copyToClipboard}>
                Copy address <i className="far fa-copy" />
              </CopyAddress>
            </Tooltip>
          </Grid>
          <Grid container item direction="column" justify="center" xs={12}>
            <div>Balance info</div>
            <div>
              {Object.keys(config.tokens).map((tokenKey) => {
                const token = config.tokens[tokenKey];
                const balance = currentUser.tokenBalances[token.address];
                if(!balance) return null;

                return (
                  <Row key={token.symbol}>
                    <Balance>{formatBalance(balance)}</Balance>
                    <a target='_blank' href={`${sanitizedExplorer}/address/${token.address}`}> {token.symbol}</a>
                  </Row>
                );
              })}
            </div>
          </Grid>
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
