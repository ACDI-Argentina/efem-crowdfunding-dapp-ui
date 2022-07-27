import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DAC from '../models/DAC';
import { history } from '@acdi/efem-dapp';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { User } from '@acdi/efem-dapp';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import IconPrimaryButton from './buttons/IconPrimaryButton';
import EditIcon from '@material-ui/icons/Edit';

class DacEdit extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    history.push(`/dacs/${this.props.dac.id}/edit`);
  };

  render() {
    const { dac, currentUser, t } = this.props;

    let isEnabled = false;
    if (currentUser &&
      currentUser.authenticated &&
      dac.isDelegate(currentUser)) {
      isEnabled = true;
    }

    return (
      <div>
        {isEnabled && (
          <OnlyCorrectNetwork>
            <IconPrimaryButton
              icon={<EditIcon />}
              onClick={this.handleClick}>
              {t('dacEdit')}
            </IconPrimaryButton>
          </OnlyCorrectNetwork>
        )}
      </div >
    );
  }
}

DacEdit.propTypes = {
  dac: PropTypes.instanceOf(DAC).isRequired,
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
    withTranslation()(DacEdit)
  )
);