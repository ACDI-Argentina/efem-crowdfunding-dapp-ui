import React from "react";
import Campaigns from "components/views/Campaigns.jsx";
import PlatformFeatures from "components/views/PlatformFeatures.jsx";
import KnowPlatform from "components/views/KnowPlatform.jsx";
import BlockchainBenefits from "components/views/BlockchainBenefits.jsx";
import { withTranslation } from 'react-i18next';
import Sponsors from "./Sponsors";
import HomeParallax from "./HomeParallax";
import Page from "components/Pages/Page";
import Grid from '@material-ui/core/Grid'
import SupportGive4Forest from "./SupportGive4Forest";

export default withTranslation()(function LandingPage(props) {
  const { t, ...rest } = props;
  return (
    <Page>
      <Grid container
        spacing={0}
        alignItems="center">
        <Grid item xs={12}>
          <HomeParallax history={props.history} />
        </Grid>
        <Grid item xs={12}>
          <KnowPlatform />
        </Grid>
        <Grid item xs={12}>
          <Campaigns />
        </Grid>
        <Grid item xs={12}>
          <PlatformFeatures />
        </Grid>
        <Grid item xs={12}>
          <BlockchainBenefits />
        </Grid>
        <Grid item xs={12}>
          <SupportGive4Forest />
        </Grid>
        <Grid item xs={12}>
          <Sponsors />
        </Grid>
      </Grid>
    </Page>
  );
});
