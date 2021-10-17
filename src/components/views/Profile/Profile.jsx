/* eslint-disable prefer-destructuring */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';

import { feathersClient } from '../../../lib/feathersClient';
import GoBackButton from '../../GoBackButton';
import Loader from '../../Loader';
import { getUserName, getUserAvatar } from '../../../lib/helpers';
import config from '../../../configuration';

import MilestonesSection from './MilestonesSection';
import CampaignsSection from './CampaignsSection';
import DacsSection from './DacsSection';
import DonationsSection from './DonationsSection';

/**
 * The user profile view mapped to /profile/{userAddress}
 *
 * @param history      Browser history object
 * @param wallet       Wallet object with the balance and all keystores
 */
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      hasError: false,
      etherScanUrl: config.network.explorer,
      userAddress: '',
      isLoadingDacs: true,
      dacs: null,
      isLoadingCampaigns: true,
      campaigns: null,
      isLoadingMilestones: true,
      milestones: null,
      visiblePages: 10,
      itemsPerPage: 25,
      skipMilestonePages: 0,
      skipCampaignPages: 0,
      skipDacPages: 0,
      skipDonationsPages: 0,
      isLoadingDonations: true,
      donations: null,
    };

    this.loadUserMilestones = this.loadUserMilestones.bind(this);
    this.loadUserCampaigns = this.loadUserCampaigns.bind(this);
    this.loadUserDacs = this.loadUserDacs.bind(this);
    this.handleMilestonePageChanged = this.handleMilestonePageChanged.bind(this);
    this.handleCampaignsPageChanged = this.handleCampaignsPageChanged.bind(this);
    this.handleDacPageChanged = this.handleDacPageChanged.bind(this);
    this.handleDonationsPageChanged = this.handleDonationsPageChanged.bind(this);
  }

  componentDidMount() {
    const { userAddress } = this.props.match.params;

    feathersClient
      .service('users')
      .find({ query: { address: userAddress } })
      .then(resp => {
        this.setState(
          Object.assign(
            {},
            {
              userAddress,
            },
            resp.data[0],
            {
              isLoading: false,
              hasError: false,
            },
          ),
          () => {
            this.loadUserCampaigns();
            this.loadUserMilestones();
            this.loadUserDacs();
            this.loadUserDonations();
          },
        );
      })
      .catch(() =>
        this.setState({
          userAddress,
          isLoading: false,
          hasError: true,
        }),
      );
  }

  componentWillUnmount() {
    if (this.dacsObserver) this.dacsObserver.unsubscribe();
    if (this.campaignsObserver) this.campaignsObserver.unsubscribe();
    if (this.milestonesObserver) this.milestonesObserver.unsubscribe();
    if (this.donationsObserver) this.donationsObserver.unsubscribe();
  }

  loadUserMilestones() {
    console.warn("Usage of deprecated feathers service milestones")
  }

  loadUserCampaigns() {
    //TODO: implement querying smart contract
    console.warn("Usage of deprecated feathers service dacs");
  }

  loadUserDacs() {
    //TODO: implement querying smart contract
    console.warn("Usage of deprecated feathers service dacs");
  }

  loadUserDonations() {
    //TODO: implement querying smart contract
    console.warn("Usage of deprecated feathers service donations");
  }

  handleMilestonePageChanged(newPage) {
    this.setState({ skipMilestonePages: newPage - 1, isLoadingMilestones: true }, () =>
      this.loadUserMilestones(),
    );
  }

  handleCampaignsPageChanged(newPage) {
    this.setState({ skipCampaignPages: newPage - 1, isLoadingCampaigns: true }, () =>
      this.loadUserCampaigns(),
    );
  }

  handleDacPageChanged(newPage) {
    this.setState({ skipDacPages: newPage - 1, isLoadingDacs: true }, () => this.loadUserDacs());
  }

  handleDonationsPageChanged(newPage) {
    this.setState({ skipDonationsPages: newPage - 1, isLoadingDonations: true }, () =>
      this.loadUserDonations(),
    );
  }

  render() {
    const { history } = this.props;
    const {
      isLoading,
      hasError,
      avatar,
      name,
      email,
      url,
      etherScanUrl,
      isLoadingDacs,
      isLoadingCampaigns,
      isLoadingMilestones,
      isLoadingDonations,
      dacs,
      campaigns,
      milestones,
      donations,
      visiblePages,
      userAddress,
    } = this.state;
    const user = {
      name,
      avatar,
    };

    return (
      <div id="profile-view">
        <div className="container-fluid page-layout dashboard-table-view">
          <div className="row">
            <div className="col-md-8 m-auto">
              {isLoading && <Loader className="fixed" />}

              {!isLoading && !hasError && (
                <div>
                  <GoBackButton history={history} />

                  <center>
                    <Avatar size={100} src={getUserAvatar(user)} round />
                    <h1>{getUserName(user)}</h1>
                    {etherScanUrl && (
                      <p>
                        <a href={`${etherScanUrl}address/${userAddress}`}>{userAddress}</a>
                      </p>
                    )}
                    {!etherScanUrl && <p>{userAddress}</p>}
                    <p>{email}</p>
                    <p><a title="User url" href={url} target="_blank" >{url}</a></p>
                  </center>
                </div>
              )}

              <DonationsSection
                isLoadingDonations={isLoadingDonations}
                donations={donations}
                visiblePages={visiblePages}
                etherScanUrl={config.network.explorer}
                handleDonationsPageChanged={this.handleDonationsPageChanged}
              />

              <DacsSection
                userAddress={userAddress}
                isLoadingDacs={isLoadingDacs}
                dacs={dacs}
                visiblePages={visiblePages}
                handleDacPageChanged={this.handleDacPageChanged}
              />
              <CampaignsSection
                userAddress={userAddress}
                isLoadingCampaigns={isLoadingCampaigns}
                campaigns={campaigns}
                visiblePages={visiblePages}
                handleCampaignsPageChanged={this.handleCampaignsPageChanged}
              />

              <MilestonesSection
                userAddress={userAddress}
                isLoadingMilestones={isLoadingMilestones}
                milestones={milestones}
                visiblePages={visiblePages}
                handleMilestonePageChanged={this.handleMilestonePageChanged}
              />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profile.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      userAddress: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default Profile;
