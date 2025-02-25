import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Milestone from 'models/Milestone';
import MilestoneCancel from './MilestoneCancel';
import MilestoneComplete from './MilestoneComplete';
import MilestoneApprove from './MilestoneApprove';
import MilestoneReject from './MilestoneReject';
import { selectCurrentUser } from 'redux/reducers/currentUserSlice';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';

class MilestoneActions extends Component {
  render() {
    const { milestone } = this.props;
    return (
      <Fragment>
        <MilestoneComplete milestone={milestone}></MilestoneComplete>
        <MilestoneApprove milestone={milestone}></MilestoneApprove>
        <MilestoneReject milestone={milestone}></MilestoneReject>
        <MilestoneCancel milestone={milestone}></MilestoneCancel>
        {/*<MilestoneWithdraw milestone={milestone} user={user} />
        <EditMilestoneButton milestone={milestone} user={user}/>*/}
      </Fragment>
    );
  }
}

MilestoneActions.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired
};

const styles = theme => ({
  root: {
    
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = {  }


export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation() (MilestoneActions)))
)