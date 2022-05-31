import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/footerStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

/**
 * The Footer section
 */
class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, t, } = this.props;

    return (
      <div className={classes.section}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={0}
        >
          <Grid item xs={8} sm={6} className={classes.leftSection}>
            <img src={require("assets/img/logos/give4forest.svg")} alt={t('give4forest')} className={classes.dappLogo} />
          </Grid>
          <Grid item xs={8} sm={6} className={classes.rightSection}>
            <h6 className={classes.description}>
              <a href="https://t.me/joinchat/et-GV-UFNsdjNzEx" target="_blank">
                <img src={require("assets/img/logos/telegram.svg")} alt={t('telegram')} className={classes.smallLogo} />{t('contactUs')}
              </a>
            </h6>
          </Grid>
        </Grid>
        <br/>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={8} sm={2}>
            <h6 className={classes.description}>
              {t('iniciativeOf')}
            </h6>
          </Grid>
          <Grid item xs={8} sm={2}>
            <a href="https://www.acdi.org.ar" target="_blank">
              <img src={require("assets/img/logos/acdi.png")} alt={t('acdi')} className={classes.logo} />
            </a>
          </Grid>
          <Grid item xs={8} sm={2}>
            <a href="https://www.rsk.co/" target="_blank">
              <img src={require("assets/img/logos/rsk.svg")} alt={t('rsk')} className={classes.logo} />
            </a>
          </Grid>
          <Grid item xs={8} sm={2}>
            <a href="https://www.iovlabs.org/" target="_blank">
              <img src={require("assets/img/logos/iovlabs.jpg")} alt={t('iovlabs')} className={classes.logo} />
            </a>
          </Grid>
        </Grid>
        <br/>
        <h6 className={classes.disclaimer}>
          <Link to="/termsandconditions" target="_blank" underline="always">
            {t('termsAndConditions')}
          </Link>
          <Link to="/privacypolicy" target="_blank" underline="always">
          {t('dataHandlingPolicy')}
          </Link>
        </h6>
      </div>
    )
  }
}

Footer.propTypes = {};

export default withTranslation()((withStyles(styles)(Footer)))
