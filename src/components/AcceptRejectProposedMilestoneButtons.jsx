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

class AcceptRejectProposedMilestoneButtons extends Component {
  constructor() {
    super();
    this.conversationModal = React.createRef();
  }

  rejectProposedMilestone() {
    this.conversationModal.current
      .openModal({
        title: 'Reject proposed milestone',
        description:
          'Optionally explain why you reject this proposed milestone. This information will be publicly visible and emailed to the milestone owner.',
        textPlaceholder: 'Optionally explain why you reject this proposal...',
        required: false,
        cta: 'Reject proposal',
        enableAttachProof: false,
      })
      .then(proof => {
        MilestoneService.rejectProposedMilestone({
          milestone: this.props.milestone,
          message: proof.message,
          onSuccess: () => React.toast.info(<p>The proposed milestone has been rejected.</p>),
          onError: e => ErrorPopup('Something went wrong with rejecting the proposed milestone', e),
        });
      });
  }

  acceptProposedMilestone() {
    const { milestone, currentUser } = this.props;
    const { checkBalance } = this.context.modals.methods;
    checkBalance(this.props.balance)
      .then(() =>
        this.conversationModal.current
          .openModal({
            title: 'Accept proposed milestone',
            description:
              'Optionally explain why you accept this proposed milestone. Compliments are appreciated! This information will be publicly visible and emailed to the milestone owner.',
            textPlaceholder: 'Optionally explain why you accept this proposal...',
            required: false,
            cta: 'Accept proposal',
            enableAttachProof: false,
          })
          .then(proof => {
            MilestoneService.acceptProposedMilestone({
              milestone,
              from: currentUser.address,
              proof,
              onTxHash: txUrl => {
                GA.trackEvent({
                  category: 'Milestone',
                  action: 'accepted proposed milestone',
                  label: milestone._id,
                });

                React.toast.info(
                  <p>
                    Accepting this milestone is pending...
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
                    The milestone has been accepted!
                    <br />
                    <a href={txUrl} target="_blank" rel="noopener noreferrer">
                      View transaction
                    </a>
                  </p>,
                );
              },
              onError: (err, txUrl) => {
                if (err === 'patch-error') {
                  ErrorPopup('Something went wrong with accepting this proposed milestone', err);
                } else {
                  ErrorPopup(
                    'Something went wrong with the transaction.',
                    `${txUrl} => ${JSON.stringify(err, null, 2)}`,
                  );
                }
              },
            });
          }),
      )
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
          milestone.campaign.ownerAddress === currentUser.address &&
          milestone.status === 'Proposed' && (
            <span>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => this.acceptProposedMilestone()}
              >
                <i className="fa fa-check-square-o" />
                &nbsp;Accept
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => this.rejectProposedMilestone()}
              >
                <i className="fa fa-times-circle-o" />
                &nbsp;Reject
              </button>
            </span>
          )}

        <ConversationModal ref={this.conversationModal} milestone={milestone} />
      </Fragment>
    );
  }
}

AcceptRejectProposedMilestoneButtons.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired,
  milestone: PropTypes.instanceOf(Milestone).isRequired,
};

AcceptRejectProposedMilestoneButtons.contextType = Web3AppContext;

export default AcceptRejectProposedMilestoneButtons;
