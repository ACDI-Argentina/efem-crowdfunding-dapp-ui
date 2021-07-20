import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Milestone from 'models/Milestone';
import BigNumber from 'bignumber.js';

import DeleteProposedMilestoneButton from 'components/DeleteProposedMilestoneButton';
import AcceptRejectProposedMilestoneButtons from 'components/AcceptRejectProposedMilestoneButtons';
import CancelMilestoneButton from 'components/CancelMilestoneButton';
import MilestoneCancel from './MilestoneCancel';
import MilestoneWithdrawButton from './MilestoneWithdrawButton';
import MilestoneComplete from './MilestoneComplete';
import MilestoneApprove from './MilestoneApprove';
import MilestoneReject from './MilestoneReject';
import EditMilestoneButton from './EditMilestoneButton';

class MilestoneActions extends Component {
  render() {
    const { milestone, user } = this.props;

    return (
      <Fragment>
        <MilestoneComplete
          milestone={milestone}>
        </MilestoneComplete>

        <MilestoneApprove
          milestone={milestone}>
        </MilestoneApprove>

        <MilestoneReject
          milestone={milestone}>
        </MilestoneReject>

        <MilestoneCancel
          milestone={milestone}>
        </MilestoneCancel>

        {<MilestoneWithdrawButton
          milestone={milestone}
          user={user} />}

        {/*
        <AcceptRejectProposedMilestoneButtons
          milestone={milestone}
          currentUser={currentUser}/>
        */}
        {/*
        <CancelMilestoneButton
          milestone={milestone}
          currentUser={currentUser}/>
        */}
        {/*
          <DeleteProposedMilestoneButton
          milestone={milestone}
          currentUser={currentUser}/>
        */}

        
        <EditMilestoneButton
          milestone={milestone}
          user={user}/>
        
      </Fragment>
    );
  }
}

MilestoneActions.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired
};

export default MilestoneActions;
