import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Loader from '../components/Loader';

import LandingPage from 'components/views/LandingPage.js';
import UserProfilePage from 'components/Pages/UserProfilePage';
import DacPage from 'components/Pages/DacPage';
import CampaignPage from 'components/Pages/CampaignPage';
const Profile = React.lazy(() => import('../components/views/Profile/Profile'));
const EditProfile = React.lazy(() => import('../components/views/EditProfile'));

const ViewDAC = React.lazy(() => import('../components/views/ViewDAC'));
const EditCampaign = React.lazy(() => import('../components/views/EditCampaign'));
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

      <Route exact path="/dacs/new" render={(props) => <DacPage />} />
      <Route exact path="/campaigns/new" render={(props) => <CampaignPage />} />
      <Route
        exact
        path="/dacs/:id"
        render={(props) => <ViewDAC currentUser={currentUser} {...props} />}
      />
      {/*<Route
        exact
        path="/dacs/:id/edit"
        render={(props) => (
          <EditDAC
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            {...props}
          />
        )}
        />*/}

      <Route exact path="/campaigns/new" render={(props) => <EditCampaign isNew {...props} />} />
      <Route
        exact
        path="/campaigns/:id"
        render={(props) => <ViewCampaign currentUser={currentUser} {...props} />}
      />
      <Route
        exact
        path="/campaigns/:id/edit"
        render={(props) => (
          <EditCampaign
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            {...props}
          />
        )}
      />

      <Route
        exact
        path="/campaigns/:id/milestones/new"
        render={(props) => (
          <EditMilestone
            isNew
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            {...props}
          />
        )}
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
        path="/campaigns/:id/milestones/:milestoneId"
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
      <Route path="/" render={(props) => <LandingPage {...props} />} />

      <Route exact path="/campaigns" render={(props) => <Campaigns {...props} />} />
      <Route exact path="/dacs" render={(props) => <DACs {...props} />} />
      {/* Other material react routes. Not used*/})
      <Route path="/landing-page" render={(props) => <LandingPage {...props} />} />

      <Route
        exact
        path="/termsandconditions"
        render={(props) => <TermsAndConditions {...props} />}
      />
      <Route exact path="/privacypolicy" render={(props) => <PrivacyPolicy {...props} />} />

      <Route component={NotFound} />
    </Switch>
  </React.Suspense>
);

export default SwitchRoutes;
