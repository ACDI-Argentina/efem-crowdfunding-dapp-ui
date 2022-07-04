import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import MilestoneService from 'services/MilestoneService';
import Milestone from 'models/Milestone';
import { User } from '@acdi/efem-dapp';
import ErrorPopup from 'components/ErrorPopup';
import ConversationModal from 'components/ConversationModal';
import GA from 'lib/GoogleAnalytics';
import { Web3AppContext } from 'lib/blockchain/Web3App';

class CancelMilestoneButton extends Component {
  constructor() {
    super();
    this.conversationModal = React.createRef();
  }

  cancelMilestone() {
    const { milestone, balance, currentUser } = this.props;
    const { checkBalance } = this.context.modals.methods;
    checkBalance(balance)
      .then(() => {
        this.conversationModal.current
          .openModal({
            title: 'Cancel milestone',
            description:
              'Explain why you cancel this milestone. Compliments are appreciated! This information will be publicly visible and emailed to the milestone owner.',
            textPlaceholder: 'Explain why you cancel this milestone...',
            required: true,
            cta: 'Cancel milestone',
            enableAttachProof: false,
          })
          .then(proof => {
            MilestoneService.cancelMilestone({
              milestone,
              from: currentUser.address,
              proof,
              onTxHash: txUrl => {
                GA.trackEvent({
                  category: 'Milestone',
                  action: 'canceled',
                  label: milestone._id,
                });

                React.toast.info(
                  <p>
                    Canceling this milestone is pending...
                    <br />
                    <a href={txUrl} target="_blank" rel="noopener noreferrer">
                      View transaction
                    </a>
                  </p>,
                );
              },
              onConfirmation: txUrl => {
                React.toast.success(
                  <p>
                    The milestone has been cancelled!
                    <br />
                    <a href={txUrl} target="_blank" rel="noopener noreferrer">
                      View transaction
                    </a>
                  </p>,
                );
              },
              onError: (err, txUrl) => {
                if (err === 'patch-error') {
                  ErrorPopup('Something went wrong with canceling your milestone', err);
                } else {
                  ErrorPopup(
                    'Something went wrong with the transaction.',
                    `${txUrl} => ${JSON.stringify(err, null, 2)}`,
                  );
                }
              },
            });
          });
      })
      .catch(err => {
        if (err === 'noBalance') {
          // handle no balance error
        }
      });
  }

  render() {
    const { milestone, currentUser } = this.props;

    return (
      <Fragment>
        {currentUser &&
          [milestone.reviewerAddress, milestone.ownerAddress].includes(currentUser.address) &&
          ['InProgress', 'NeedReview'].includes(milestone.status) &&
          milestone.mined && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => this.cancelMilestone()}
            >
              <i className="fa fa-times" />
              &nbsp;Cancel
            </button>
          )}

        <ConversationModal ref={this.conversationModal} milestone={milestone} />
      </Fragment>
    );
  }
}

CancelMilestoneButton.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

CancelMilestoneButton.contextType = Web3AppContext;

export default CancelMilestoneButton;
