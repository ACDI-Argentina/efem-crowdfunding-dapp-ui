import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getTruncatedText } from '../lib/helpers'
import { history } from '@acdi/efem-dapp';
import DAC from '../models/DAC'
import messageUtils from '../redux/utils/messageUtils'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import StatusCard from './StatusCard'
import { selectCascadeDonationsByDac, selectCascadeFiatAmountTargetByDac } from '../redux/reducers/dacsSlice'
import DonationsBalanceMini from './DonationsBalanceMini'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Donate from './Donate'
import DacCardMini from './DacCardMini'
import Grid from '@material-ui/core/Grid'

class DacCard extends Component {

  constructor(props) {
    super(props);
    this.viewDac = this.viewDac.bind(this);
  }

  viewDac() {
    if (this.props.dac.isPending) {
      messageUtils.addMessageWarn({ text: 'La DAC no ha sido confirmada aún.' });
    } else {
      history.push(`/dacs/${this.props.dac.id}`);
    }
  }

  render() {
    const { classes, t, dac, cascadeDonationIds, cascadeFiatAmountTarget } = this.props;

    return (
      <Card
        className={classes.root}>
        <CardActionArea onClick={this.viewDac}>
          <CardMedia
            component="img"
            height="150"
            image={dac.imageCidUrl}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {getTruncatedText(dac.title, 40)}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.description}>
              {getTruncatedText(dac.description, 200)}
            </Typography>
            <DonationsBalanceMini
              donationIds={cascadeDonationIds}
              fiatTarget={cascadeFiatAmountTarget}>
            </DonationsBalanceMini>
            <StatusCard status={dac.status} />
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Grid
            container
            direction="row"
            justify="flex-end"
          >
            <Grid item xs={6} className={classes.actions}>
              <Donate
                entityId={dac.id}
                entityCard={<DacCardMini dac={dac} />}
                title={t('donateDacTitle')}
                description={t('donateDacDescription')}
                enabled={dac.canReceiveFunds}>
              </Donate>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

DacCard.propTypes = {
  dac: PropTypes.instanceOf(DAC).isRequired
};

DacCard.defaultProps = {};

const styles = theme => ({
  root: {

  },
  description: {
    height: '7em'
  },
  actions: {
    textAlign: 'right'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    cascadeDonationIds: selectCascadeDonationsByDac(state, ownProps.dac.id),
    cascadeFiatAmountTarget: selectCascadeFiatAmountTargetByDac(state, ownProps.dac.id)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation()(DacCard)))
)