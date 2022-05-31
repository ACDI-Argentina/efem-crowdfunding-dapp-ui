import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";

// Sections for this page
import Campaigns from "components/views/Campaigns.jsx";
import PlatformFeatures from "components/views/PlatformFeatures.jsx";
import BlockchainBenefits from "components/views/BlockchainBenefits.jsx";
import JoinGivethCommunity from 'components/JoinGivethCommunity.jsx';
import MainMenu from "components/MainMenu.jsx";

import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { withTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);

export default withTranslation()(function LandingPage(props) {
  const classes = useStyles();
  const { t,...rest } = props;
  
  return (
    <div className={classes.landingPage}>
      <Header
        color="white"
        brand={<img style={{minHeight: '80px'}} src={require("assets/img/logos/give4forest.svg")}
        alt={t('give4forest')}
        className={classes.dappLogo}/>}
        rightLinks={<MainMenu />}
        {...rest}
      />
      <Parallax image={require("assets/img/landing-bg.jpg")}>
      <div className={classes.container}>
          <GridContainer justifyContent="center">
            <GridItem xs={12} sm={12} md={12}>
              <div className={classes.titleContainer}>
                <h2 className={classes.title}>{t('landingPageTitle')}</h2>
                <h4 className={classes.subtitle}>
                  {t('landingPagesSubtitle1')}<span className={classes.subtitleHighlight}>{t('landingPagesSubtitle2')}</span>{t('landingPagesSubtitle3')}
                </h4>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <JoinGivethCommunity history={props.history} />
          <Campaigns />
          <PlatformFeatures />
          <BlockchainBenefits />
          <Footer />
        </div>
      </div>
    </div>
  );
});
