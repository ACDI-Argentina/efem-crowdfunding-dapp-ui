import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Hidden } from '@material-ui/core';
import { history } from 'lib/helpers'
import knowPlatformImg from "assets/img/know-platform.png";
import SecondaryButton from 'components/buttons/SecondaryButton';
import Typography from '@material-ui/core/Typography';

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
      <div className={classes.root}>

        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="flex-end"
          spacing={2}
          className={classes.container}>

          <Grid item xs={5}>

            <Grid container
              spacing={2}>
              <Grid item>
                <Typography variant="h6">
                  <span className={classes.textHighlight}>{t('knowPlatform1')}</span><span>{t('knowPlatform2')}</span>
                </Typography>
              </Grid>
              <Grid item>
                <SecondaryButton onClick={() => this.handleClickAbout()}>
                  {t('knowPlatformKnowMoreButton')}
                </SecondaryButton>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={3}>
            <Hidden xsDown>
              <center>
                <img src={require("assets/img/logos/give4forestBadge.png")}
                  className={classes.knowPlatformImg} />
              </center>
            </Hidden>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    backgroundImage: "url(" + knowPlatformImg + ")",
    backgroundSize: "100%",
    backgroundRepeat: 'no-repeat'
  },
  container: {
    padding: "12em 0",
    alignItems: "center"
  },
  textHighlight: {
    color: theme.palette.secondary.main
  },
  knowPlatformImg: {
    width: "90%"
  }
});

KnowPlatform.propTypes = {};

export default withTranslation()((withStyles(styles)(KnowPlatform)))
