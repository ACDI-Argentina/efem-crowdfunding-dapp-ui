import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Loader from '../Loader';
import User from '../../models/User';
import { getTruncatedText, history } from '../../lib/helpers';
import CampaignService from '../../services/CampaignService';
import Campaign from '../../models/Campaign';
import AuthenticationWarning from '../AuthenticationWarning';
import { Web3AppContext } from 'lib/blockchain/Web3App';

/**
 * The my campaings view
 */
class MyCampaigns extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      campaigns: {},
      visiblePages: 10,
      skipPages: 0,
      itemsPerPage: 50,
    };

    this.editCampaign = this.editCampaign.bind(this);
    this.cancelCampaign = this.cancelCampaign.bind(this);
    this.handlePageChanged = this.handlePageChanged.bind(this);
  }

  componentDidMount() {
    const { authenticateIfPossible } = this.context.modals.methods;
    authenticateIfPossible(this.props.currentUser)
      .then(() => this.loadCampaigns())
      .catch(err => {
        if (err === 'notLoggedIn') {
          // default behavior is to go home or signin page after swal popup
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentUser !== this.props.currentUser) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isLoading: true });
      if (this.campaignsObserver) this.campaignsObserver.unsubscribe();
      this.loadCampaigns();
    }
  }

  componentWillUnmount() {
    if (this.campaignsObserver) this.campaignsObserver.unsubscribe();
  }

  loadCampaigns() {
    this.campaignsObserver = CampaignService.getUserCampaigns(
      this.props.currentUser.address,
      this.state.skipPages,
      this.state.itemsPerPage,
      campaigns => this.setState({ campaigns, isLoading: false }),
      () => this.setState({ isLoading: false }),
    );
  }

  editCampaign(id) {
    /*checkBalance(this.props.balance)
      .then(() => {
        history.push(`/campaigns/${id}/edit`);
      })
      .catch(err => {
        if (err === 'noBalance') {
          // handle no balance error
        }
      });*/
  }

  cancelCampaign(campaign) {
    /*checkBalance(this.props.balance).then(() => {
      const confirmCancelCampaign = () => {
        const afterCreate = url => {
          const msg = (
            <p>
              Campaign cancelation pending...
              <br />
              <a href={url} target="_blank" rel="noopener noreferrer">
                View transaction
              </a>
            </p>
          );
          React.toast.info(msg);
          GA.trackEvent({
            category: 'Campaign',
            action: 'canceled',
            label: campaign.id,
          });
        };

        const afterMined = url => {
          const msg = (
            <p>
              The campaign has been cancelled!
              <br />
              <a href={url} target="_blank" rel="noopener noreferrer">
                View transaction
              </a>
            </p>
          );
          React.toast.success(msg);
        };
        campaign.cancel(this.props.currentUser.address, afterCreate, afterMined);
      };
      confirmationDialog('campaign', campaign.title, confirmCancelCampaign);
    });*/
  }

  handlePageChanged(newPage) {
    this.setState({ skipPages: newPage - 1 }, () => this.loadCampaigns());
  }

  render() {
    const { campaigns, isLoading, visiblePages } = this.state;
    const { currentUser } = this.props;

    return (
      <div id="campaigns-view">
        <div className="container-fluid page-layout dashboard-table-view">
          <div className="row">
            <div className="col-md-10 m-auto">
              {(isLoading || (campaigns && campaigns.data.length > 0)) && <h1>Your campaigns</h1>}

              <AuthenticationWarning currentUser={currentUser} />

              {isLoading && <Loader className="fixed" />}

              {!isLoading && (
                <div className="table-container">
                  {campaigns && campaigns.data.length > 0 && (
                    <div>
                      <table className="table table-responsive table-striped table-hover">
                        <thead>
                          <tr>
                            {currentUser.authenticated && <th className="td-actions" />}
                            <th className="td-name">Name</th>
                            <th className="td-donations-number">Donaciones</th>
                            <th className="td-donations-amount">Monto</th>
                            <th className="td-status">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaigns.data.map(c => (
                            <tr
                              key={c.id}
                              className={c.status === Campaign.PENDING ? 'pending' : ''}
                            >
                              {currentUser.authenticated && (
                                <td className="td-actions">
                                  {c.owner.address === currentUser.address && c.isActive && (
                                    <button
                                      type="button"
                                      className="btn btn-link"
                                      onClick={() => this.editCampaign(c.id)}
                                    >
                                      <i className="fa fa-edit" />
                                      &nbsp;Editar
                                    </button>
                                  )}

                                  {(c.reviewerAddress === currentUser.address ||
                                    c.owner.address === currentUser.address) &&
                                    c.isActive && (
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => this.cancelCampaign(c)}
                                      >
                                        <i className="fa fa-ban" />
                                        &nbsp;Cancelar
                                      </button>
                                    )}
                                </td>
                              )}
                              <td className="td-name">
                                <Link to={`/campaigns/${c.id}`}>
                                  {getTruncatedText(c.title, 45)}
                                </Link>
                                {c.reviewerAddress === currentUser.address && (
                                  <span className="badge badge-info">
                                    <i className="fa fa-eye" />
                                    &nbsp;I&apos;m reviewer
                                  </span>
                                )}
                              </td>
                              <td className="td-donations-number">
                                {c.donationCounters.length > 0 &&
                                  c.donationCounters.map(counter => (
                                    <p key={`donation_count-${c.key}-${counter.symbol}`}>
                                      {counter.donationCount} donation(s) in {counter.symbol}
                                    </p>
                                  ))}
                                {c.donationCounters.length === 0 && <span>-</span>}
                              </td>
                              <td className="td-donations-amount">
                                {c.donationCounters.length > 0 &&
                                  c.donationCounters.map(counter => (
                                    <p key={`total_donated-${c.key}-${counter.symbol}`}>
                                      {counter.totalDonated.toString()} {counter.symbol}
                                    </p>
                                  ))}
                                {c.donationCounters.length === 0 && <span>-</span>}
                              </td>
                              <td className="td-status">
                                {(c.status === Campaign.PENDING ||
                                  (Object.keys(c).includes('mined') && !c.mined)) && (
                                  <span>
                                    <i className="fa fa-circle-o-notch fa-spin" />
                                    &nbsp;
                                  </span>
                                )}
                                {c.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {campaigns.total > this.state.itemsPerPage && (
                        <center>
                          <Pagination
                            activePage={campaigns.skip / campaigns.limit + 1}
                            itemsCountPerPage={campaigns.limit}
                            totalItemsCount={campaigns.total}
                            pageRangeDisplayed={visiblePages}
                            onChange={this.handlePageChanged}
                          />
                        </center>
                      )}
                    </div>
                  )}

                  {campaigns && campaigns.data.length === 0 && (
                    <div>
                      <center>
                        <h3>&iexcl;A&uacute;n no creaste campa&ntilde;as!</h3>
                        <img
                          className="empty-state-img"
                          src={`${process.env.PUBLIC_URL}/img/campaign.svg`}
                          width="200px"
                          height="200px"
                          alt="no-campaigns-icon"
                        />
                      </center>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MyCampaigns.contextType = Web3AppContext;

MyCampaigns.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  //balance: PropTypes.objectOf(utils.BN).isRequired,
};

export default MyCampaigns;
