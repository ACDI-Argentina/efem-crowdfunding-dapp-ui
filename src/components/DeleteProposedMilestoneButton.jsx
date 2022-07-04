import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import MilestoneService from 'services/MilestoneService';
import Milestone from 'models/Milestone';
import { User } from '@acdi/efem-dapp';
import ErrorPopup from 'components/ErrorPopup';
import confirmationDialog from 'lib/confirmationDialog';

const DeleteProposedMilestoneButton = ({ milestone, currentUser }) => {
  const _confirmDeleteMilestone = () => {
    MilestoneService.deleteProposedMilestone({
      milestone,
      onSuccess: () => React.toast.info(<p>The milestone has been deleted.</p>),
      onError: e => ErrorPopup('Something went wrong with deleting your milestone', e),
    });
  };

  const _deleteProposedMilestone = () =>
    confirmationDialog('milestone', milestone.title, _confirmDeleteMilestone);

  return (
    <Fragment>
      {currentUser &&
        milestone.ownerAddress === currentUser.address &&
        ['Proposed', 'Rejected'].includes(milestone.status) && (
          <span>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={_deleteProposedMilestone}
            >
              <i className="fa fa-times-circle-o" />
              &nbsp;Delete
            </button>
          </span>
        )}
    </Fragment>
  );
};

DeleteProposedMilestoneButton.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

export default DeleteProposedMilestoneButton;
