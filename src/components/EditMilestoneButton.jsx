import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Milestone from 'models/Milestone';
import { User } from '@acdi/efem-dapp';
import { history } from '@acdi/efem-dapp';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { withTranslation } from 'react-i18next';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';

class EditMilestoneButton extends Component {
  editMilestone() {
    const { milestone } = this.props;

    if (milestone.isActive || milestone.isRejected) {
      history.push(`/campaigns/${milestone.campaignId}/milestones/${milestone.id}/edit/proposed`);
    } else {
      history.push(`/campaigns/${milestone.campaignId}/milestones/${milestone.id}/edit`);
    }
  }

  render() {
    const { milestone, user, t } = this.props;
    //if (!user || !milestone.inEditableStatus() || !milestone.canUserEdit(user)) {
      return null;
    //}

    return (
      <OnlyCorrectNetwork>
        <Button
          color="primary"
          variant="contained"
          type="button"
          startIcon={<EditIcon />}
          style={{ margin: "4px" }}
          onClick={() => this.editMilestone()}>
          {t('edit')}
        </Button>
      </OnlyCorrectNetwork>
    );
  }
}

EditMilestoneButton.propTypes = {
  user: PropTypes.instanceOf(User).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

export default withTranslation()(EditMilestoneButton);
