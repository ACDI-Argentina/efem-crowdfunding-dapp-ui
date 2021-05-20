import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/platformFeaturesStyle.js";
import classNames from "classnames";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

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
      <div className={classes.section}>
        <h2 className={classes.title}>
          {t('platformFeaturesTitle1')}
          <span className={classes.underlineHighlight}>{t('platformFeaturesTitle2')}</span>
          {t('platformFeaturesTitle3')}
          {t('platformFeaturesTitle4')}
          <span className={classes.colorHighlight}>{t('platformFeaturesTitle5')}</span>
        </h2>
        <h6 className={classes.description}>
          {t('platformFeaturesDescription1')}
          <span className={classes.boldText}>{t('platformFeaturesDescription2')}</span>
          {t('platformFeaturesDescription3')}
          <span className={classNames(classes.boldText, classes.italicText)}>{t('platformFeaturesDescription4')}</span>
        </h6>
        {
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={10}
          >
            <Grid item xs={12} sm={4} md={4} lg={3} xl={3}>
              <div>
                <img src={require("assets/img/icons/colaboracion.png")} alt={t('colaboration')} className={classes.image} />
              </div>
              <div className={classes.sectionTitle}>{t('colaboration')}</div>
              <h6 className={classes.sectionDescription}>
                {t('colaborationDescription1')}
                <span className={classes.boldText}>{t('colaborationDescription2')}</span>
                {t('colaborationDescription3')}
              </h6>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3} xl={3}>
              <div>
                <img src={require("assets/img/icons/conexion.png")} alt={t('connection')} className={classes.image} />
              </div>
              <div className={classes.sectionTitle}>{t('connection')}</div>
              <h6 className={classes.sectionDescription}>
                {t('connectionDescription1')}
                <span className={classes.boldText}>{t('connectionDescription2')}</span>
                {t('connectionDescription3')}
                <span className={classes.boldText}>{t('connectionDescription4')}</span>
                {t('connectionDescription5')}
              </h6>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3} xl={3}>
              <div>
                <img src={require("assets/img/icons/intimidad.png")} alt={t('intimacy')} className={classes.image} />
              </div>
              <div className={classes.sectionTitle}>{t('intimacy')}</div>
              <h6 className={classes.sectionDescription}>
                {t('intimacyDescription1')}
                <span className={classes.boldText}>{t('intimacyDescription2')}</span>
                {t('intimacyDescription3')}
                <span className={classes.boldText}>{t('intimacyDescription4')}</span>
                {t('intimacyDescription5')}
              </h6>
            </Grid>              
          </Grid>
        }
      </div>
    )
  }
}

PlatformFeatures.propTypes = {};

export default withTranslation()((withStyles(styles)(PlatformFeatures)))
