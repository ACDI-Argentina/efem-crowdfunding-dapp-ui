import React from 'react';
import { Route, Switch } from 'react-router-dom';
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
import UsersPage from 'components/Pages/UsersPage'
import UserPage from 'components/Pages/UserPage'
import CreateSolutionsPage from 'components/Pages/CreateSolutionsPage';
import ViewSolutionsPage from 'components/Pages/ViewSolutionsPage';
import NewsPage from 'components/Pages/NewsPage';

const Profile = React.lazy(() => import('../components/views/Profile/Profile'));

const NotFound = React.lazy(() => import('../components/views/NotFound'));

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

      <Route path="/create-solutions"
        render={(props) => <CreateSolutionsPage {...props} />} />

      <Route path="/view-solutions"
        render={(props) => <ViewSolutionsPage {...props} />} />

      <Route path="/news"
        render={(props) => <NewsPage {...props} />} />

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
        path="/campaigns/:id"
        render={(props) => <CampaignViewPage {...props} />}
      />

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
        path="/milestones/:id"
        render={(props) => <MilestoneViewPage {...props} />}
      />

      <Route
        exact
        path="/profile"
        render={props => (
          <UserProfilePage />
        )}
      />
      <Route
        exact
        path="/profile/:userAddress"
        render={(props) => <Profile {...props} />} />

      <Route
        exact
        path="/termsandconditions"
        render={(props) => <TermsAndConditions {...props} />}
      />
      <Route
        exact
        path="/privacypolicy"
        render={(props) => <PrivacyPolicy {...props} />} />

<Route
            exact
            path="/users"
            render={props => (
                <UsersPage
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />
        <Route
            exact
            path="/user/:userAddress/edit"
            render={props => (
                <UserPage
                    key={currentUser ? currentUser.id : 0}
                    {...props}
                />
            )}
        />

      <Route path="/"
        render={(props) => <LandingPage {...props} />} />

      <Route component={NotFound} />
    </Switch>
  </React.Suspense>
);

export default SwitchRoutes;
