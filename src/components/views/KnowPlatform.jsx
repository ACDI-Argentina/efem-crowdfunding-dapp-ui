import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/knowPlatformStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Hidden, Button } from '@material-ui/core';
import { history } from 'lib/helpers'

/**
 * The KnowPlatform section
 */
class KnowPlatform extends Component {
  constructor(props) {
    super(props);
  }

  handleClickAbout() {
    history.push(`/about`);
  }

  render() {
    const { classes, t, } = this.props;

    return (
      <Grid container justifyContent="center" className={classes.container}>
        <Grid item xs={10} sm={8} lg={8}>
          <div className={classes.paragraphText}><span className={classes.paragraphTextHighlight}>{t('knowPlatform1')}</span><span>{t('knowPlatform2')}</span></div>
          <Button variant="primary" color="tertiary" size="lg" className={classes.dropShadowButton} onClick={() => this.handleClickAbout()}>
            {t('knowPlatformKnowMoreButton')}
          </Button>
        </Grid>
        <Grid item sm={4} lg={4}>
          <Hidden xsDown>
            <center>
              <img
                src={require("assets/img/logos/give4forestBadge.svg")} alt={t('telegram')} className={classes.knowPlatformImg} />
            </center>
          </Hidden>
        </Grid>
      </Grid>
    )
  }
}

KnowPlatform.propTypes = {};

export default withTranslation()((withStyles(styles)(KnowPlatform)))
