import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import backgroundImg from "assets/img/supportG4F.jpg";
import Typography from '@material-ui/core/Typography';
import SecondaryButton from 'components/buttons/SecondaryButton';

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
      <div className={classes.root}>

        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={0}>

          <Grid item xs={6} className={classes.leftItem}>
          </Grid>

          <Grid item xs={6} className={classes.rightItem}>

            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={2}>

              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom="true" >
                  {t('supportGive4ForestTitle')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom="true" >
                  {t('supportGive4ForestText')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <SecondaryButton onClick={() => this.handleClickDonate()}>
                  {t('supportGive4ForestButtonLabel')}
                </SecondaryButton>
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
    backgroundColor: theme.palette.primary.main
  },
  leftItem: {
    backgroundImage: "url(" + backgroundImg + ")",
    backgroundSize: "cover",
    backgroundPosition: "center",
    flexGrow: "1",
    "&:after": {
      content: "''",
      backgroundColor: "rgba(22, 222, 222, 0.5)",
    }
  },
  rightItem: {
    width: "80%",
    padding: "4em 2em"
  }
});

SupportGive4Forest.propTypes = {};

export default withTranslation()((withStyles(styles)(SupportGive4Forest)))
