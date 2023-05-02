import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { withTranslation, Trans } from 'react-i18next'
import { withStyles } from '@material-ui/core/styles';
import platformFeaturesBackground from "assets/img/platform-features-background.png";
import Typography from '@material-ui/core/Typography';

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
      <div className={classes.root}>

        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="flex-end"
          spacing={5}
          className={classes.container}>

          <Grid item xs={8}>
            <Typography variant="h3" className={classes.text}>
              {t('platformFeaturesTitle')}
            </Typography>
          </Grid>

          <Grid item xs={8}>

            <Grid container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={5}>

              <Grid item xs={6}>
                <img src={require("assets/img/platformFeatures1.png")} className={classes.image} />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h4"
                  className={classes.text}
                  gutterBottom>
                  {t('platformFeatures1Title')}
                </Typography>
                <Typography variant="body1"
                  className={classes.text}>
                  <Trans i18nKey="platformFeatures1Text" components={{ b: <b /> }} />
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={8}>

            <Grid container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={5}>

              <Grid item xs={5}>
                <Typography variant="h4"
                  className={classes.text}
                  gutterBottom>
                  {t('platformFeatures2Title')}
                </Typography>
                <Typography variant="body1"
                  className={classes.text}>
                  <Trans i18nKey="platformFeatures2Text" components={{ b: <b /> }} />
                </Typography>
              </Grid>

              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <img src={require("assets/img/platformFeatures2.png")} className={classes.image} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={8}>

            <Grid container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={5}>

              <Grid item xs={6}>
                <img src={require("assets/img/platformFeatures3.png")} className={classes.image} />
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h4"
                  className={classes.text}
                  gutterBottom>
                  {t('platformFeatures3Title')}
                </Typography>
                <Typography variant="body1"
                  className={classes.text}>
                  <Trans i18nKey="platformFeatures3Text" components={{ b: <b /> }} />
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={8}>

            <Grid container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={5}>

              <Grid item xs={5}>
                <Typography variant="h4"
                  className={classes.text}
                  gutterBottom>
                  {t('platformFeatures4Title')}
                </Typography>
                <Typography variant="body1"
                  className={classes.text}>
                  <Trans i18nKey="platformFeatures4Text" components={{ b: <b /> }} />
                </Typography>
              </Grid>

              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <img src={require("assets/img/platformFeatures4.png")} className={classes.image} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    backgroundImage: "url(" + platformFeaturesBackground + ")",
    backgroundSize: "100%",
    backgroundRepeat: 'no-repeat'
  },
  container: {
    paddingTop: '12em',
    paddingBottom: '8em'
  },
  text: {
    color: theme.palette.common.white
  },
  image: {
    width: "80%"
  }
});

PlatformFeatures.propTypes = {};

export default withTranslation()((withStyles(styles)(PlatformFeatures)))
