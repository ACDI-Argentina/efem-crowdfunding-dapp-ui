import React, { useRef, useContext, useState } from 'react';
import styled from 'styled-components';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Grid, IconButton, Typography, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { AppTransactionContext } from 'lib/blockchain/Web3App';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const useStyles = makeStyles(theme => ({
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
}));

const LinkButton = styled.a`
  color: #53a653;
  font-weight:bold;
  padding:10px;
  :hover{
    text-decoration: underline;
    color: #53a653;
  }
  
`
const Footer = styled.div`
  padding:10px;
`

const Address = styled.div`
  font-family:Rubik, sans-serif;
  font-weight:400;
  font-size: 1.3em;
  padding:1em;
  color: gray;
  word-break: break-all;
`
const Button = styled.button`
  padding: .2em 1em;
  border-radius: 1em; 
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
              0px 2px 2px 0px rgba(0, 0, 0, 0.14),
              0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  border: 1px solid transparent;
`

const LogoutButton = styled(Button)`
  color: white;
  background-color: #FF5D49;
  font-weight: bold;
  font-size: 1.1em;
`

const CopyAddress = styled.div`
  font-weight:bold;
  cursor:pointer;
  padding:10px;
  color: #53a653;
`


const AccountDialog = ({ address, onClose, ...props }) => {
  const classes = useStyles();
  const title = "Your wallet";
  const { explorer, closeAccount } = useContext(AppTransactionContext);

  const sanitizedExplorer = explorer?.endsWith("/") ? explorer?.slice(0, -1) : explorer;
  const explorerLink = `${sanitizedExplorer}/address/${address}`;

  const [showTooltip, setShowTooltip] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(address);
    //show popup copied!by a seconds
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1000);
  }

  return (
    <Dialog
      onClose={onClose}
      TransitionComponent={Transition}
      {...props}
    >
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
            <Address>
              {address}
            </Address>
          </Grid>
          <Grid container justify="center" align="center" item sm={4} xs={12}>
            <LinkButton
              target="_blank"
              href={explorerLink}>
              View on RSK explorer
            </LinkButton>

          </Grid>
          <Grid container justify="center" align="center" item sm={4} xs={12}>
            <Tooltip open={showTooltip} title="Copied!" placement="top">
              <CopyAddress onClick={copyToClipboard}>
                Copy address <i className="far fa-copy"></i>
              </CopyAddress>
            </Tooltip>
          </Grid>
          <Grid
            container
            item
            justify="center"
            xs={12}
          >
            <Footer>
              <LogoutButton
                onClick={() => {
                  closeAccount();
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
  )
}
export default AccountDialog;
