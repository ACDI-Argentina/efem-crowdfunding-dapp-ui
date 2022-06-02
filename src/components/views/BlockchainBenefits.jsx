import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/blockchainBenefitsStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import BlockchainBenefitsCard from './BlockchainBenefitsCard';

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
      <Grid container justifyContent="center" className={classes.container}>
        <Grid item xs={12}>
          <h2 className={classes.title}>{t('blockchainBenefitsTitle')}</h2>
        </Grid>
        <Grid item xs={12}>
          <h4 className={classes.subtitle}>{t('blockchainBenefitsDescription')}</h4>
        </Grid>
        <Grid item xs={12} className={classes.separator}></Grid>
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item alignItems="stretch" xs={3}>
            <BlockchainBenefitsCard
              backgroundColor="#A1B651"
              iconSrc={require("assets/img/icons/blockchain1.svg")}
              legend={t('blockchainBenefits1Legend')} />
          </Grid>
          <Grid item alignItems="stretch" xs={3}>
            <BlockchainBenefitsCard
              backgroundColor="#C4CBFF"
              iconSrc={require("assets/img/icons/blockchain2.svg")}
              legend={t('blockchainBenefits2Legend')} />
          </Grid>
          <Grid item alignItems="stretch" xs={3}>
            <BlockchainBenefitsCard
              backgroundColor="#43E0A9"
              iconSrc={require("assets/img/icons/blockchain3.svg")}
              legend={t('blockchainBenefits3Legend')} />
          </Grid>
          <Grid item alignItems="stretch" xs={3}>
            <BlockchainBenefitsCard
              backgroundColor="#F8652F"
              iconSrc={require("assets/img/icons/blockchain4.svg")}
              legend={t('blockchainBenefits4Legend')} />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

BlockchainBenefits.propTypes = {};

export default withTranslation()((withStyles(styles)(BlockchainBenefits)))
