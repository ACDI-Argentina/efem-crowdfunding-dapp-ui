import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import platformFeaturesBackground from "assets/img/platformFeaturesBackground.png";
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
          spacing={10}
          className={classes.container}>

          <Grid item xs={8}>
            <Typography variant="h3" color="textSecondary">
              {t('platformFeaturesTitle')}
            </Typography>
          </Grid>

          <Grid item xs={8}>

            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}>

              <Grid item xs={5}>
                <img src={require("assets/img/platformFeatures1.jpg")} className={classes.image} />
              </Grid>
              <Grid item xs={7}>
                <Typography variant="h4" color="textSecondary" gutterBottom="true">
                  {t('platformFeatures1Title')}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {t('platformFeatures1Text')}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={8}>

            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}>

              <Grid item xs={7}>
                <Typography variant="h4" color="textSecondary" gutterBottom="true">
                  {t('platformFeatures2Title')}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {t('platformFeatures2Text')}
                </Typography>
              </Grid>

              <Grid item xs={5} style={{ textAlign: 'right' }}>
                <img src={require("assets/img/platformFeatures2.jpg")} className={classes.image} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={8}>

            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}>

              <Grid item xs={5}>
                <img src={require("assets/img/platformFeatures3.jpg")} className={classes.image} />
              </Grid>
              <Grid item xs={7}>
                <Typography variant="h4" color="textSecondary" gutterBottom="true">
                  {t('platformFeatures3Title')}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {t('platformFeatures3Text')}
                </Typography>
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
    paddingTop: '55em',
    paddingBottom: '5em'
  },
  image: {
    width: "80%"
  }
});

PlatformFeatures.propTypes = {};

export default withTranslation()((withStyles(styles)(PlatformFeatures)))
