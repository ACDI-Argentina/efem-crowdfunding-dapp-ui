import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Campaign from '../models/Campaign';
import { history } from '@acdi/efem-dapp';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { User } from '@acdi/efem-dapp';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import IconPrimaryButton from './buttons/IconPrimaryButton';
import AddIcon from '@material-ui/icons/Add';
import {
  CREATE_CAMPAIGN_ROLE
} from 'constants/Role';

class CampaignNew extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    history.push(`/dacs/${this.props.dac.id}/campaigns/new`);
  };

  render() {
    const { currentUser, t } = this.props;

    let isEnabled = false;
    if (currentUser &&
      currentUser.authenticated &&
      currentUser.hasRole(CREATE_CAMPAIGN_ROLE)) {
      isEnabled = true;
    }

    return (
      <div>
        {isEnabled && (
          <OnlyCorrectNetwork>
            <IconPrimaryButton
              icon={<AddIcon />}
              onClick={this.handleClick}>
              {t('campaignNew')}
            </IconPrimaryButton>
          </OnlyCorrectNetwork>
        )}
      </div >
    );
  }
}

CampaignNew.propTypes = {
  campaign: PropTypes.instanceOf(Campaign).isRequired,
  currentUser: PropTypes.instanceOf(User).isRequired
};

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(CampaignNew)
  )
);