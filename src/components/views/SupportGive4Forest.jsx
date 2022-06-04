import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/supportGive4ForestStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Hidden, Button } from '@material-ui/core';
import { history } from 'lib/helpers'

/**
 * The SupportGive4Forest section
 */
class SupportGive4Forest extends Component {
  constructor(props) {
    super(props);
  }

  handleClickDonate() {
    // TODO: implementar
  }

  render() {
    const { classes, t, } = this.props;

    return (
      <Grid container justifyContent="center" alignItems="stretch" className={classes.container}>
        <Grid item xs={6} sm={6} className={classes.supportBackgroundImg}>
        </Grid>
        <Grid item xs={6} sm={6}>
          <div className={classes.leftContainer}>
            <h2 className={classes.title}>{t('supportGive4ForestTitle')}</h2>
            <div className={classes.paragraphText}>{t('supportGive4ForestText')}</div>
            <Button variant="primary" size="lg" className={classes.dropShadowButton} onClick={() => this.handleClickDonate()}>
              {t('supportGive4ForestButtonLabel')}
            </Button>
          </div>
        </Grid>
      </Grid>
    )
  }
}

SupportGive4Forest.propTypes = {};

export default withTranslation()((withStyles(styles)(SupportGive4Forest)))
