import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import CommunityButton from './CommunityButton';
import User from '../models/User';

import { connect } from 'react-redux';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';

import OnlyRole from '../components/OnlyRole';

import { CREATE_DAC_ROLE, CREATE_CAMPAIGN_ROLE } from "../constants/Role";

import Button from "components/CustomButtons/Button.js";
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import { dropShadowButton } from 'assets/jss/material-kit-react/components/customButtonStyle';
import { withStyles } from '@material-ui/core/styles';

/**
 * The join Giveth community top-bar
 */
class JoinGivethCommunity extends Component {
  constructor(props) {
    super(props);

    this.createDAC = this.createDAC.bind(this);
    this.createCampaign = this.createCampaign.bind(this);
  }

  createDAC() {
    const { currentUser } = this.props;
    const isDelegate = currentUser && currentUser.isDelegate();

    if (!isDelegate) {
      React.swal({
        title: 'Sorry, this Dapp is in beta...',
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to start a Decentralized Fund. However, this Dapp
            is still in beta and we only allow a select group of people to start Funds
            <br />
            Please <strong>contact us on our Slack</strong>, or keep browsing
          </p>,
        ),
        icon: 'info',
        buttons: [false, 'Got it'],
      });
      return;
    }

    if (this.props.currentUser) {
      this.props.history.push('/dacs/new');
    } else {
      React.swal({
        title: "You're almost there...",
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to start a Decentralized Fund. To get started,
            please sign up (or sign in) first.
          </p>,
        ),
        icon: 'info',
        buttons: ['Cancel', 'Sign up now!'],
      }).then(isConfirmed => {
        if (isConfirmed) this.props.history.push('/signup');
      });
    }
  }

  createCampaign() {
    const { currentUser } = this.props;
    const isCampaignManager = currentUser && currentUser.isCampaignManager();

    if (!isCampaignManager) {
      React.swal({
        title: 'Sorry, this Dapp is in beta...',
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to start a campaign, however, this Dapp is still
            in beta and we only allow a select group of people to start campaigns
            <br />
            Please <strong>contact us on our Slack</strong>, or keep browsing
          </p>,
        ),
        icon: 'info',
        buttons: [false, 'Got it'],
      });
      return;
    }
    if (this.props.currentUser) {
      this.props.history.push('/campaigns/new');
    } else {
      React.swal({
        title: "You're almost there...",
        content: React.swal.msg(
          <p>
            It&#8217;s great to see that you want to start a campaign. To get started, please sign
            up (or sign in) first.
          </p>,
        ),
        icon: 'info',
        buttons: ['Cancel', 'Sign up now!'],
      }).then(isConfirmed => {
        if (isConfirmed) this.props.history.push('/signup');
      });
    }
  }

  render() {

    const { classes } = this.props;

    return (
      <div
        id="join-giveth-community"
      >
        <div className="vertical-align">
          <center>
            <OnlyCorrectNetwork>
              <OnlyRole role={CREATE_DAC_ROLE}>
                <Button variant="contained" color="primary" size="lg" className={classes.dropShadowButton} onClick={() => this.createDAC()}>
                  Crear una DAC
                </Button>
              </OnlyRole>
              <OnlyRole role={CREATE_CAMPAIGN_ROLE}>
                <Button variant="contained" color="primary" size="lg" className={classes.dropShadowButton} onClick={() => this.createCampaign()}>
                  Iniciar una campa&ntilde;a
                </Button>
              </OnlyRole>
            </OnlyCorrectNetwork>            
          </center>
        </div>
      </div>
    );
  }
}

JoinGivethCommunity.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
};

JoinGivethCommunity.defaultProps = {
  currentUser: undefined,
};

const mapStateToProps = (state, props) => ({
  currentUser: selectCurrentUser(state)
});
const mapDispatchToProps = {};

const styles = {
  dropShadowButton: {
      ...dropShadowButton,
      margin: ".5em"
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(JoinGivethCommunity));