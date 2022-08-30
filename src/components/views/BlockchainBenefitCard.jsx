import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';

/**
 * The BlockchainBenefitCard section
 */
class BlockchainBenefitCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { backgroundColor, iconSrc, legend, classes } = this.props;
    return (
      <Card className={classes.root} style={{ backgroundColor: backgroundColor }}>
        <CardContent>
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            className={classes.container}>
            <Grid item xs={12} className={classes.grid}>
              <img src={iconSrc} className={classes.image} />
            </Grid>
            <Grid item xs={12} className={classes.grid}>
              <Typography variant="body1">
                {legend}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

const styles = theme => ({
  root: {
    color: theme.palette.common.white,
    paddingTop: '0.75em',
    paddingBottom: '0.75em',
    borderRadius: "5px",
    height: "100%",
    "&:hover": {
      borderRadius: "5px",
      boxShadow: `8px 8px 0px 0px ${theme.palette.primary.light}`,
      textTransform: "none",
    }
  },
  grid: {
    textAlign: 'center'
  },
  image: {
    height: "4em"
  }
});

BlockchainBenefitCard.propTypes = {};

export default withTranslation()(withStyles(styles)(BlockchainBenefitCard))
