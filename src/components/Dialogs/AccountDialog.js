import React, { useRef } from 'react';
import styled from 'styled-components';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Grid, IconButton, Typography } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

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

`



const AccountDialog = ({ address, onClose, ...props }) => {
  const classes = useStyles();
  const addressRef = useRef();
  const title = "Your wallet";
  const explorer = "https://explorer.testnet.rsk.co"; //TODO: Read from context

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
          <Grid item xs={12}>
            {address}
          </Grid>
          <Grid item sm={6}>
            <LinkButton
              target="_blank"
              href={`${explorer}/address/${address}`}>
              View on rsk explorer
            </LinkButton>
          </Grid>
          <Grid item sm={6}>
            <input ref={addressRef} type="hidden" value={address}/>
            <div>Copy address</div>
          </Grid>
          <Grid item xs={12}>
            Logout button
          </Grid>

        </Grid>

      </div>

    </Dialog>
  )
}
export default AccountDialog;
