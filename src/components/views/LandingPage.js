import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Footer from "components/Footer/Footer.js";

// Sections for this page
import Campaigns from "components/views/Campaigns.jsx";
import PlatformFeatures from "components/views/PlatformFeatures.jsx";
import KnowPlatform from "components/views/KnowPlatform.jsx";
import BlockchainBenefits from "components/views/BlockchainBenefits.jsx";
import JoinGivethCommunity from 'components/JoinGivethCommunity.jsx';

import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { withTranslation } from 'react-i18next';
import Sponsors from "./Sponsors";
import HomeParallax from "./HomeParallax";
import Page from "components/Pages/Page";
import Grid from '@material-ui/core/Grid'
import SupportGive4Forest from "./SupportGive4Forest";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress";


const useStyles = makeStyles(styles);

export default withTranslation()(function LandingPage(props) {
  const classes = useStyles();
  const { t, ...rest } = props;

  return (
    <Page>
      <Grid container
        spacing={0}
        alignItems="center">
        <Grid item xs={12}>
          <HomeParallax history={props.history} />
        </Grid>

        <Grid item sm={1} lg={2}></Grid>
        <Grid item sm={10} lg={8}>
          <KnowPlatform />
        </Grid>
        <Grid item sm={1} lg={2}></Grid>

        <Grid item sm={1} lg={2}></Grid>
        <Grid item sm={10} lg={8}>
          <Campaigns />
        </Grid>
        <Grid item sm={1} lg={2}></Grid>

        <Grid container className={classes.platformFeaturesBkg}>
          <Grid item sm={1} lg={2}></Grid>
          <Grid item sm={10} lg={8}>
            <PlatformFeatures />
          </Grid>
          <Grid item sm={1} lg={2}></Grid>
        </Grid>

        <Grid item sm={1} lg={2}></Grid>
        <Grid item sm={10} lg={8}>
          <BlockchainBenefits />
        </Grid>
        <Grid item sm={1} lg={2}></Grid>

        <Grid item sm={12} lg={12}>
          <SupportGive4Forest />
        </Grid>

        <Grid item sm={1} lg={2}></Grid>
        <Grid style={{ margin: "4em 0"}} item sm={10} lg={8}>
          <Sponsors />
        </Grid>
        <Grid item sm={1} lg={2}></Grid>

      </Grid>
    </Page>
  );
});
