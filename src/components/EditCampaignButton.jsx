import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { User } from '@acdi/efem-dapp';
import { history } from 'lib/helpers';
import Campaign from '../models/Campaign';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

import { withTranslation } from 'react-i18next';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';

class EditCampaignButton extends Component {
  editCampaign() {
    const { campaign } = this.props;
    history.push(`/campaigns/${campaign.id}/edit`);
  }

  render() {
    const { campaign, currentUser, t } = this.props;

    if (campaign.isManager(currentUser)) {
      return (
        <OnlyCorrectNetwork>
          <Button
            color="primary"
            variant="contained"
            type="button"
            startIcon={<EditIcon />}
            style={{margin: "4px"}}
            onClick={() => this.editCampaign()}>
            {t('edit')}
          </Button>
        </OnlyCorrectNetwork>        
        );
    } else { //not allowed to edit campaign
      return null;
    }
  }
}

EditCampaignButton.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  campaign: PropTypes.instanceOf(Campaign).isRequired,
};

export default withTranslation()(EditCampaignButton);



