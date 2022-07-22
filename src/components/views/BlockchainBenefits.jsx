import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import BlockchainBenefitCard from './BlockchainBenefitCard';
import Typography from '@material-ui/core/Typography';

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
      <div className={classes.root}>

        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="flex-end"
          spacing={3}
          className={classes.container}>

          <Grid item xs={8}>
            <Typography variant="h3"
              gutterBottom
              className={classes.title}>
              {t('blockchainBenefitsTitle')}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography variant="body1" >
              {t('blockchainBenefitsDescription')}
            </Typography>
          </Grid>

          <Grid item xs={8}>

            <Grid container
              direction="row"
              alignItems="stretch"
              spacing={3}>

              <Grid item xs={3}>
                <BlockchainBenefitCard
                  backgroundColor="#A1B651"
                  iconSrc={require("assets/img/icons/blockchain1.svg")}
                  legend={t('blockchainBenefits1Legend')} />
              </Grid>

              <Grid item xs={3}>
                <BlockchainBenefitCard
                  backgroundColor="#C4CBFF"
                  iconSrc={require("assets/img/icons/blockchain2.svg")}
                  legend={t('blockchainBenefits2Legend')} />
              </Grid>

              <Grid item xs={3}>
                <BlockchainBenefitCard
                  backgroundColor="#43E0A9"
                  iconSrc={require("assets/img/icons/blockchain3.svg")}
                  legend={t('blockchainBenefits3Legend')} />
              </Grid>

              <Grid item xs={3}>
                <BlockchainBenefitCard
                  backgroundColor="#F8652F"
                  iconSrc={require("assets/img/icons/blockchain4.svg")}
                  legend={t('blockchainBenefits4Legend')} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const styles = theme => ({
  container: {
    padding: "4em 0"
  },
  title: {
    color: theme.palette.secondary.main
  }
});

BlockchainBenefits.propTypes = {};

export default withTranslation()((withStyles(styles)(BlockchainBenefits)))
