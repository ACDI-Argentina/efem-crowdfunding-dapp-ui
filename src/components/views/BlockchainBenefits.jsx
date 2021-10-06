import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/blockchainBenefitsStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

/**
 * The BlockchainBenefits section
 */
class BlockchainBenefits extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, t, } = this.props;

    return (
      <div className={classes.section}>
        <h3 className={classes.title}>{t('blockchainBenefitsTitle')}</h3>
        {
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={10}
          >
            <Grid item xs={12} sm={4} md={4} lg={3} xl={3} className={classes.benefitSection}>
              <div>
                <img src={require("assets/img/icons/sinFronteras.png")} alt={t('blockchainHelpBenefitTitle')} className={classes.image} />
              </div>
              <div className={classes.sectionTitle}>{t('blockchainHelpBenefitTitle')}</div>
              <h6 className={classes.sectionDescription}>{t('blockchainHelpBenefitDescription')}</h6>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3} xl={3} className={classes.benefitSection}>
              <div>
                <img src={require("assets/img/icons/confianza.png")} alt={t('blockchainTrustBenefitTitle')} className={classes.image} />
              </div>
              <div className={classes.sectionTitle}>{t('blockchainTrustBenefitTitle')}</div>
              <h6 className={classes.sectionDescription}>{t('blockchainTrustBenefitDescription')}</h6>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3} xl={3} className={classes.benefitSection}>
              <div>
                <img src={require("assets/img/icons/seguridad.png")} alt={t('blockchainSecurityBenefitTitle')} className={classes.image} />
              </div>
              <div className={classes.sectionTitle}>{t('blockchainSecurityBenefitTitle')}</div>
              <h6 className={classes.sectionDescription}>{t('blockchainSecurityBenefitDescription')}</h6>
            </Grid>              
          </Grid>
        }
      </div>
    )
  }
}

BlockchainBenefits.propTypes = {};

export default withTranslation()((withStyles(styles)(BlockchainBenefits)))
