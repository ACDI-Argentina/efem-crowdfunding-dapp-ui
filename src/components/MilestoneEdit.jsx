import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Milestone from '../models/Milestone';
import { history } from '@acdi/efem-dapp';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { User } from '@acdi/efem-dapp';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import IconPrimaryButton from './buttons/IconPrimaryButton';
import EditIcon from '@material-ui/icons/Edit';

class MilestoneEdit extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    history.push(`/milestones/${this.props.milestone.id}/edit`);
  };

  render() {
    const { milestone, currentUser, t } = this.props;

    let isEnabled = false;
    if (currentUser &&
      currentUser.authenticated &&
      milestone.isActive &&
      milestone.isManager(currentUser)) {
      isEnabled = true;
    }

    return (
      <div>
        {isEnabled && (
          <OnlyCorrectNetwork>
            <IconPrimaryButton
              icon={<EditIcon />}
              onClick={this.handleClick}>
              {t('milestoneEdit')}
            </IconPrimaryButton>
          </OnlyCorrectNetwork>
        )}
      </div >
    );
  }
}

MilestoneEdit.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired,
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
    withTranslation()(MilestoneEdit)
  )
);