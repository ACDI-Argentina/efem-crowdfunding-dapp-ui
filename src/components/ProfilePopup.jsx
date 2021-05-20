import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import User from 'models/User';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import ProfileForm from './ProfileForm';

import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Web3AppContext } from 'lib/blockchain/Web3App';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ProfilePopup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: props.open || false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    const { authenticateIfPossible } = this.context.modals.methods;
    authenticateIfPossible(this.props.currentUser).catch(err => {}) /* Esto hace aparecer el modal pidiendole que firme la transaccion */
  }

  handleClickOpen() {
    this.open();
  };

  handleClose() {
    this.close();
    this.props.handleClose && this.props.handleClose();
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
    const { open } = this.state;
    const { currentUser, classes, t, requireFullProfile = false } = this.props;

    return (
      <div>
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
                {"Profile"}
              </Typography>

            </Toolbar>
          </AppBar>
          <div className={classes.root}>
            <Grid >
              <div className="alert alert-warning">
                <i className="fa fa-exclamation-triangle" />
                  Due to the amount of the donation we need you to complete some information before.<br/>
                  For more information please see our {' '}
                <Link to="/termsandconditions">Terms and Conditions</Link> and{' '}
                <Link to="/privacypolicy">Privacy Policy</Link>.
              </div>

              <ProfileForm
                user={currentUser}
                showCompact={true}
                requireFullProfile={requireFullProfile}
                onFinishEdition={() => {
                  //TODO: HANDLE result
                  this.setState({open:false})
                }}
              ></ProfileForm>
            </Grid>
          </div>
        </Dialog>
      </div >
    );
  }
}

ProfilePopup.contextType = Web3AppContext;

ProfilePopup.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
};

ProfilePopup.defaultProps = {
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '1em',
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
    margin: theme.spacing(1),
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(ProfilePopup)
  )
);