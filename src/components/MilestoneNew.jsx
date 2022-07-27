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
import { isOwner } from 'lib/helpers';

class MilestoneNew extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    history.push(`/campaigns/${this.props.campaign.id}/milestones/new`);
  };

  render() {
    const { campaign, currentUser, t } = this.props;

    let isEnabled = false;
    if (currentUser &&
      currentUser.authenticated &&
      isOwner(campaign.managerAddress, currentUser)) {
      isEnabled = true;
    }

    return (
      <div>
        {isEnabled && (
          <OnlyCorrectNetwork>
            <IconPrimaryButton
              icon={<AddIcon />}
              onClick={this.handleClick}>
              {t('milestoneNew')}
            </IconPrimaryButton>
          </OnlyCorrectNetwork>
        )}
      </div >
    );
  }
}

MilestoneNew.propTypes = {
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
    withTranslation()(MilestoneNew)
  )
);