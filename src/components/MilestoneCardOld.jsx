import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getTruncatedText } from '../lib/helpers'
import { history } from '@acdi/efem-dapp';
import messageUtils from '../redux/utils/messageUtils'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import StatusCard from './StatusCard'
import DonationsBalanceMini from './DonationsBalanceMini'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Donate from './Donate'
import MilestoneCardMini from './MilestoneCardMini'
import Milestone from '../models/Milestone'
import { selectCampaign } from '../redux/reducers/campaignsSlice'
import Grid from '@material-ui/core/Grid';

class MilestoneCard extends Component {

  constructor(props) {
    super(props);
    this.viewMilestone = this.viewMilestone.bind(this);
  }

  viewMilestone() {
    if (this.props.milestone.isPending) {
      messageUtils.addMessageWarn({ text: 'El milestone no ha sido confirmado aún.' });
    } else {
      history.push(
        `/campaigns/${this.props.campaign.id}/milestones/${this.props.milestone.id}`,
      );
    }
  }

  render() {
    const { classes, t, milestone, campaign } = this.props;

    // TODO Ver cómo implementar esto de manera correcta.
    if (campaign == undefined) {
      return (
        <div></div>
      )
    }

    return (
      <Card
        className={classes.root}>
        <CardActionArea onClick={this.viewMilestone}>
          <CardMedia
            component="img"
            height="150"
            image={milestone.imageCidUrl}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {getTruncatedText(milestone.title, 40)}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.description}>
              {getTruncatedText(milestone.description, 200)}
            </Typography>
            <DonationsBalanceMini
              donationIds={milestone.budgetDonationIds}
              fiatTarget={milestone.fiatAmountTarget}>
            </DonationsBalanceMini>
            <StatusCard status={milestone.status} />
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
                entityId={milestone.id}
                entityCard={<MilestoneCardMini milestone={milestone} />}
                title={t('donateMilestoneTitle')}
                description={t('donateMilestoneDescription')}
                enabled={milestone.canReceiveFunds}>
              </Donate>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

MilestoneCard.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired
};

MilestoneCard.defaultProps = {};

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
    campaign: selectCampaign(state, ownProps.milestone.campaignId)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation()(MilestoneCard)))
)