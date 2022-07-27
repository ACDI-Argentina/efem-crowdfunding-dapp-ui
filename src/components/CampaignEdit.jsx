import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Campaign from '../models/Campaign';
import { history } from 'lib/helpers';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { User } from '@acdi/efem-dapp';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import IconPrimaryButton from './buttons/IconPrimaryButton';
import EditIcon from '@material-ui/icons/Edit';

class CampaignEdit extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    history.push(`/campaigns/${this.props.campaign.id}/edit`);
  };

  render() {
    const { campaign, currentUser, t } = this.props;

    let isEnabled = false;
    if (currentUser &&
      currentUser.authenticated &&
      campaign.isManager(currentUser)) {
      isEnabled = true;
    }

    return (
      <div>
        {isEnabled && (
          <OnlyCorrectNetwork>
            <IconPrimaryButton
              icon={<EditIcon />}
              onClick={this.handleClick}>
              {t('campaignEdit')}
            </IconPrimaryButton>
          </OnlyCorrectNetwork>
        )}
      </div >
    );
  }
}

CampaignEdit.propTypes = {
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
    withTranslation()(CampaignEdit)
  )
);