import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import LandingPage from 'views/LandingPage/LandingPage.js';
import Loader from '../components/Loader';
const Profile = React.lazy(() => import('../components/views/Profile'));
const EditProfile = React.lazy(() => import('../components/views/EditProfile'));
const ViewMilestone = React.lazy(() => import('../components/views/ViewMilestone'));
const EditDAC = React.lazy(() => import('../components/views/EditDAC'));
const ViewDAC = React.lazy(() => import('../components/views/ViewDAC'));
const MyDACs = React.lazy(() => import('../components/views/MyDACs'));
const MyCampaigns = React.lazy(() => import('../components/views/MyCampaigns'));
const MyMilestones = React.lazy(() => import('../components/views/MyMilestones'));
const NotFound = React.lazy(() => import('../components/views/NotFound'));
const Campaigns = React.lazy(() => import('../components/views/Campaigns'));
const DACs = React.lazy(() => import('../components/views/DACs'));
const TermsAndConditions = React.lazy(() => import('../components/views/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('../components/views/PrivacyPolicy'));
const EditCampaign = React.lazy(() => import('../components/views/EditCampaign'));
const ViewCampaign = React.lazy(() => import('../components/views/ViewCampaign'));
const EditMilestone = React.lazy(() => import('../components/views/EditMilestone'));

const SwitchRoutes = ({ currentUser }) => (
  <React.Suspense fallback={<Loader className="fixed"/>}>
    <Switch>
      {/*NOTE order matters, wrong order breaks routes!*/}
      <Route
        exact
        path="/termsandconditions"
        render={(props) => <TermsAndConditions {...props} />}
      />
      <Route exact path="/privacypolicy" render={(props) => <PrivacyPolicy {...props} />} />
      <Route exact path="/dacs/new" render={(props) => <EditDAC isNew {...props} />} />
      <Route
        exact
        path="/dacs/:id"
        render={(props) => <ViewDAC currentUser={currentUser} {...props} />}
      />
      <Route
        exact
        path="/dacs/:id/edit"
        render={(props) => (
          <EditDAC key={currentUser ? currentUser.id : 0} currentUser={currentUser} {...props} />
        )}
      />
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
        path="/my-dacs"
        render={(props) => (
          <MyDACs key={currentUser ? currentUser.id : 0} currentUser={currentUser} {...props} />
        )}
      />
      <Route
        exact
        path="/my-campaigns"
        render={(props) => (
          <MyCampaigns
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/my-milestones"
        render={(props) => (
          <MyMilestones
            key={currentUser ? currentUser.id : 0}
            currentUser={currentUser}
            {...props}
          />
        )}
      />
      <Route
        exact
        path="/profile"
        render={(props) => <EditProfile key={currentUser ? currentUser.id : 0} {...props} />}
      />
      <Route exact path="/profile/:userAddress" render={(props) => <Profile {...props} />} />
      <Route path="/" render={(props) => <LandingPage {...props} />} />
      {/*<Route
            exact
            path="/"
            render={props => <Explore {...props} />}
        />*/}
      <Route exact path="/campaigns" render={(props) => <Campaigns {...props} />} />
      <Route exact path="/dacs" render={(props) => <DACs {...props} />} />
      {/* Other material react routes. Not used*/})
      <Route path="/landing-page" render={(props) => <LandingPage {...props} />} />
      <Route component={NotFound} />
    </Switch>
  </React.Suspense>
);

export default SwitchRoutes;
