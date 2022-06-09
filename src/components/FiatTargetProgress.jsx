import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import BigNumber from 'bignumber.js'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import FiatUtils from '../utils/FiatUtils'
import CustomLinearProgress from './CustomLinearProgress/CustomLinearProgress';

class FiatTargetProgress extends Component {

  constructor() {
    super();
  }

  render() {
    const { fiatBalance, fiatTarget, classes, t } = this.props;

    // El balance tiene ub objetivo para mostrar.
    let progress = 0;
    // Cálculo del porcentaje de avance.
    if (!fiatBalance.isZero()) {
      if (!fiatTarget.isZero() && fiatBalance.lt(fiatTarget)) {
        progress = parseFloat(fiatBalance.div(fiatTarget).multipliedBy(100).toFixed(2));
      } else {
        // El objetivo fue alcanzado.
        progress = 100.00;
      }
    }
    let progressText = `${progress}%`;

    return (
      <Grid container
        spacing={0}
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        className={classes.root}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" component="span">
            {progressText}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomLinearProgress
            color="primary"
            variant="determinate"
            value={progress} />
        </Grid>
        <Grid container
            spacing={2}
            justifyContent="flex-start"
            alignItems="center">
          <Grid item xs={7}>
            <Typography variant="body2"
              color="textSecondary"
              component="div"
              style={{ fontWeight: 600 }}>
              {t('targetProgressRaised')}
            </Typography>
            <Typography variant="body2"
              color="textSecondary"
              component="div">
              {FiatUtils.format(fiatBalance)}
            </Typography>
          </Grid>
          <Grid item xs={5}>
          <Typography variant="body2"
              color="textSecondary"
              component="div"
              style={{ fontWeight: 600 }}>
              {t('targetProgressGoal')}
            </Typography>
            <Typography variant="body2"
              color="textSecondary"
              component="div">
              {FiatUtils.format(fiatTarget)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

FiatTargetProgress.propTypes = {
  fiatBalance: PropTypes.instanceOf(BigNumber).isRequired,
  fiatTarget: PropTypes.instanceOf(BigNumber).isRequired
};

FiatTargetProgress.defaultProps = {
  
};

const styles = theme => ({
  root: {
    marginTop: '0.5em'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(FiatTargetProgress)
  )
);