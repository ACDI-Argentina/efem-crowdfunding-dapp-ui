import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { User } from '@acdi/efem-dapp';
import { history } from 'lib/helpers';
import DAC from '../models/DAC';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

import { withTranslation } from 'react-i18next';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';

class EditDACButton extends Component {
  editDac() {
    const { dac } = this.props;
    history.push(`/dacs/${dac.id}/edit`);
  }

  render() {
    const { dac, currentUser, t } = this.props;

    if (dac.isDelegate(currentUser)) {
      return (
        <OnlyCorrectNetwork>
          <Button
            color="primary"
            variant="contained"
            type="button"
            startIcon={<EditIcon />}
            style={{margin: "4px"}}
            onClick={() => this.editDac()}>
            {t('edit')}
          </Button>
        </OnlyCorrectNetwork>        
        );
    } else { //not allowed to edit dac
      return null;
    }
  }
}

EditDACButton.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  dac: PropTypes.instanceOf(DAC).isRequired,
};

export default withTranslation()(EditDACButton);



