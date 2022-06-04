import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/platformFeaturesStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Hidden } from '@material-ui/core';

/**
 * The PlatformFeatures section
 */
class PlatformFeatures extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, t, } = this.props;

    return (
      <Grid container justifyContent="center" className={classes.container}>
        <Grid item xs={12}>
          <h2 className={classes.title}>{t('platformFeaturesTitle')}</h2>
        </Grid>

        <Grid item xs={5} style={{ textAlign: "left"}}>
          <img src={require("assets/img/platformFeatures1.jpg")} className={classes.image} />
        </Grid>
        <Grid item xs={7} style={{ paddingLeft: "1em"}}>
          <h3 className={classes.sectionTitle}>{t('platformFeatures1Title')}</h3>
          <div className={classes.sectionDescription}>{t('platformFeatures1Text')}</div>
        </Grid>

        <Grid item xs={12} className={classes.separator}></Grid>

        <Grid item xs={7} style={{ paddingRight: "1em", textAlign: "right"}}>
          <h3 className={classes.sectionTitle}>{t('platformFeatures2Title')}</h3>
          <div className={classes.sectionDescription}>{t('platformFeatures2Text')}</div>
        </Grid>
        <Grid item xs={5} style={{ textAlign: "right"}}>
          <img src={require("assets/img/platformFeatures2.jpg")} className={classes.image} />
        </Grid>

        <Grid item xs={12} className={classes.separator}></Grid>

        <Grid item xs={5} style={{ textAlign: "left"}}>
          <img src={require("assets/img/platformFeatures3.jpg")} className={classes.image} />
        </Grid>
        <Grid item xs={7} style={{ paddingLeft: "1em"}}>
          <h3 className={classes.sectionTitle}>{t('platformFeatures3Title')}</h3>
          <div className={classes.sectionDescription}>{t('platformFeatures3Text')}</div>
        </Grid>

      </Grid>
    )
  }
}

PlatformFeatures.propTypes = {};

export default withTranslation()((withStyles(styles)(PlatformFeatures)))
