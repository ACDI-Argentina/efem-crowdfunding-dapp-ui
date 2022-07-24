import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Milestone from '../models/Milestone';
import { User } from '@acdi/efem-dapp';
import { connect } from 'react-redux'
import { withdraw } from '../redux/reducers/milestonesSlice';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { withTranslation } from 'react-i18next';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import IconPrimaryButton from './buttons/IconPrimaryButton';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { withStyles } from '@material-ui/core/styles';

/**
 * Boton de retiro de fondos del Milestone
 */
class MilestoneWithdraw extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick() {
    const { milestone } = this.props;
    milestone.status = Milestone.PAYING;
    this.props.withdraw(milestone);
  }

  render() {
    const { milestone, currentUser, t } = this.props;
    /*let buttonLabel = milestone.isRecipient(currentUser) ? t('milestoneWithdrawLabel') : t('milestoneRefundLabel');
    let isEnabled = false;
    if ((milestone.isRecipient(currentUser) || milestone.isManager(currentUser)) && milestone.isApproved) {
      isEnabled = true;
    }*/

    let buttonLabel = t('milestoneWithdrawLabel');
    let isEnabled = false;
    if (currentUser &&
      currentUser.authenticated &&
      milestone.isRecipient(currentUser) &&
      milestone.isApproved) {
      isEnabled = true;
    }

    return (
      <div>
        {isEnabled && (
          <OnlyCorrectNetwork>
            <IconPrimaryButton
              icon={<AttachMoneyIcon />}
              onClick={this.handleClick}>
              {buttonLabel}
            </IconPrimaryButton>
          </OnlyCorrectNetwork>
        )}
      </div>
    );
  }
}

MilestoneWithdraw.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
  }
}

const mapDispatchToProps = { withdraw }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(MilestoneWithdraw)))
);