import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { history } from '@acdi/efem-dapp';
import messageUtils from '../redux/utils/messageUtils'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import DonationsBalanceMini from './DonationsBalanceMini'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Donate from './Donate'
import Grid from '@material-ui/core/Grid'
import SecondaryButton from './buttons/SecondaryButton'
import MilestoneCardMini from './MilestoneCardMini'
import { Milestone } from 'models'

class MilestoneCard extends Component {

  constructor(props) {
    super(props);
    this.viewMilestone = this.viewMilestone.bind(this);
  }

  viewMilestone() {
    if (this.props.milestone.isPending) {
      messageUtils.addMessageWarn({ text: 'El milestone no ha sido confirmado aún.' });
    } else {
      history.push(`/milestones/${this.props.milestone.id}`,);
    }
  }

  render() {
    const { milestone, t, classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardMedia
          component="img"
          height="120"
          image={milestone.imageCidUrl}
        />
        <CardContent className={classes.content}>
          <Typography variant="subtitle2">
            {milestone.title}
          </Typography>
          <Typography
            variant="body2"
            color="textPrimary"
            component="p"
            className={classes.abstract}>
            {milestone.abstract}
          </Typography>
          <DonationsBalanceMini
            donationIds={milestone.budgetDonationIds}
            fiatTarget={milestone.fiatAmountTarget}>
          </DonationsBalanceMini>
        </CardContent>
        <CardActions className={classes.actions}>
          <Grid
            container
            direction="row"
            spacing={3}>
            <Grid item xs={6} className={classes.actionGridLeft}>
              <Donate
                entityId={milestone.id}
                entityCard={<MilestoneCardMini milestone={milestone} />}
                title={t('donateMilestoneTitle')}
                description={t('donateMilestoneDescription')}
                enabled={milestone.canReceiveFunds}>
              </Donate>
            </Grid>
            <Grid item xs={6} className={classes.actionGridRight}>
              <SecondaryButton
                onClick={this.viewMilestone}>
                {t('openDetail')}
              </SecondaryButton>
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
  abstract: {
    height: '6em'
  },
  content: {
    paddingBottom: '0px'
  },
  actions: {
    marginTop: '0px',
    marginBottom: '0px'
  },
  actionGridLeft: {
    textAlign: 'right'
  },
  actionGridRight: {
    textAlign: 'left'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation()(MilestoneCard)))
)