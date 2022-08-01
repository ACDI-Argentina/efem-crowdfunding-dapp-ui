import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Loader from '../components/Loader';

import LandingPage from 'components/Pages/LandingPage';
import AboutPage from 'components/Pages/AboutPage';
import FaqPage from 'components/Pages/FaqPage';
import UserProfilePage from 'components/Pages/UserProfilePage';
import DacPage from 'components/Pages/DacPage';
import CampaignPage from 'components/Pages/CampaignPage';
import CampaignViewPage from 'components/Pages/CampaignViewPage';
import MilestonePage from 'components/Pages/MilestonePage';
import MilestoneViewPage from 'components/Pages/MilestoneViewPage';
import DacViewPage from 'components/Pages/DacViewPage';
const Profile = React.lazy(() => import('../components/views/Profile/Profile'));
const EditProfile = React.lazy(() => import('../components/views/EditProfile'));

const ViewDAC = React.lazy(() => import('../components/views/ViewDAC'));
const ViewCampaign = React.lazy(() => import('../components/views/ViewCampaign'));
const EditMilestone = React.lazy(() => import('../components/views/EditMilestone'));
const ViewMilestone = React.lazy(() => import('../components/views/ViewMilestone'));

const NotFound = React.lazy(() => import('../components/views/NotFound'));
const DACs = React.lazy(() => import('../components/views/DACs'));
const Campaigns = React.lazy(() => import('../components/views/Campaigns'));

const TermsAndConditions = React.lazy(() => import('../components/views/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('../components/views/PrivacyPolicy'));

const SwitchRoutes = ({ currentUser }) => (
  <React.Suspense fallback={<Loader className="fixed" />}>
    <Switch>
      {/*NOTE order matters, wrong order breaks routes!*/}

      <Route path="/about"
        render={(props) => <AboutPage {...props} />} />

      <Route path="/faq"
        render={(props) => <FaqPage {...props} />} />

      <Route
        exact
        path="/dacs/new"
        render={(props) => <DacPage {...props} />} />
      <Route
        exact
        path="/dacs/:dacId/edit"
        render={(props) => <DacPage {...props} />} />
      <Route
        exact
        path="/dacs/:id"
        render={(props) => <DacViewPage {...props} />}
      />

      <Route
        exact
        path="/dacs/:dacId/campaigns/new"
        render={(props) => <CampaignPage {...props} />} />

      <Route
        exact
        path="/campaigns/:campaignId/edit"
        render={(props) => <CampaignPage {...props} />} />

      <Route
        exact
        path="/campaigns/:campaignId/milestones/new"
        render={(props) => (
          <MilestonePage {...props} />
        )}
      />

      <Route
        exact
        path="/milestones/:milestoneId/edit"
        render={(props) => (
          <MilestonePage {...props} />
        )}
      />

      <Route
        exact
        path="/campaigns/:id"
        render={(props) => <CampaignViewPage {...props} />}
      />

      <Route
        exact
        path="/campaigns2/:id"
        render={(props) => <ViewCampaign {...props} />}
      />

      <Route
        exact
        path="/milestones/:id"
        render={(props) => <MilestoneViewPage {...props} />}
      />

      <Route
        exact
        path="/campaigns/:id/milestones/propose"
        render={(props) => (
          <EditMilestone
            isNew
            isProposed
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/campaigns2/:id/milestones/:milestoneId"
        render={(props) => <ViewMilestone currentUser={currentUser} {...props} />}
      />
      <Route
        exact
        path="/campaigns/:id/milestones/:milestoneId/edit/proposed"
        render={(props) => (
          <EditMilestone
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            isProposed
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/campaigns/:id/milestones/:milestoneId/edit"
        render={(props) => (
          <EditMilestone
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/campaigns/:id/milestones"
        render={({ match }) => <Redirect to={`/campaigns/${match.params.id}`} />}
      />
      <Route
        exact
        path="/milestones/:milestoneId/edit"
        render={(props) => (
          <EditMilestone
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/milestones/:milestoneId/edit/proposed"
        render={(props) => (
          <EditMilestone
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            isProposed
            {...props}
          />
        )}
      />
      {/*<Route
            exact
            path="/delegations"
            render={props => (
                <Delegations
                    key={currentUser ? currentUser.id : 0}
                    currentUser={currentUser}
                    {...props}
                />
            )}
        />*/}
      <Route
        exact
        path="/profile"
        render={props => (
          <UserProfilePage />
        )}
      />
      <Route exact path="/profile/:userAddress" render={(props) => <Profile {...props} />} />




      <Route
        exact
        path="/termsandconditions"
        render={(props) => <TermsAndConditions {...props} />}
      />
      <Route exact path="/privacypolicy" render={(props) => <PrivacyPolicy {...props} />} />

      <Route path="/"
        render={(props) => <LandingPage {...props} />} />

      <Route component={NotFound} />
    </Switch>
  </React.Suspense>
);

export default SwitchRoutes;
