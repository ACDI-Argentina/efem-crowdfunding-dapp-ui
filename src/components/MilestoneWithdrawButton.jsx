import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Milestone from '../models/Milestone';
import { User } from '@acdi/efem-dapp';
import { connect } from 'react-redux'
import { withdraw } from '../redux/reducers/milestonesSlice';

/**
 * Boton de retiro de fondos del Milestone
 */
class MilestoneWithdrawButton extends Component {

  constructor(props) {
    super(props);
    this.withdraw = this.withdraw.bind(this);
  }

  async withdraw() {
    const { milestone } = this.props;
    milestone.status = Milestone.PAYING;
    this.props.withdraw(milestone);
  }

  render() {
    const { milestone, user } = this.props;
    let showButton = (milestone.isRecipient(user) /*|| milestone.isManager(user)*/)
      && milestone.isApproved;
    let buttonLabel = /*milestone.isRecipient(user)*/ true ? 'Retirar' : 'Desembolsar';
    return (
      <Fragment>
        {showButton && (
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => this.withdraw()}
            style={{margin: '4px'}}>            
            <i className="fa fa-usd" />{' '}{buttonLabel}
          </button>
        )}
      </Fragment>
    );
  }
}

MilestoneWithdrawButton.propTypes = {
  user: PropTypes.instanceOf(User).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = { withdraw }

export default connect(mapStateToProps, mapDispatchToProps)(MilestoneWithdrawButton);
