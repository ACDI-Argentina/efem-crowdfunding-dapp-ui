import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getTruncatedText, history } from '../lib/helpers'
import Campaign from '../models/Campaign'
import messageUtils from '../redux/utils/messageUtils'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import { selectCascadeDonationsByCampaign, selectCascadeFiatAmountTargetByCampaign } from '../redux/reducers/campaignsSlice'
import DonationsBalanceMini from './DonationsBalanceMini'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Donate from './Donate'
import CampaignCardMini from './CampaignCardMini'
import Grid from '@material-ui/core/Grid'
import SecondaryButton from './buttons/SecondaryButton'

class CampaignCard extends Component {

  constructor(props) {
    super(props);
    this.viewCampaign = this.viewCampaign.bind(this);
  }

  viewCampaign() {
    if (this.props.campaign.isPending) {
      messageUtils.addMessageWarn({ text: 'La campaña no ha sido confirmada aún.' });
    } else {
      history.push(`/campaigns/${this.props.campaign.id}`);
    }
  }

  render() {
    const { campaign,
      cascadeDonationIds,
      cascadeFiatAmountTarget,
      t,
      classes } = this.props;

    return (
      <Card className={classes.root}>
        <CardMedia
          component="img"
          height="150"
          image={campaign.imageCidUrl}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {campaign.title}
          </Typography>
          <Typography
            variant="body2"
            color="textPrimary"
            component="p"
            className={classes.abstract}>
            {campaign.abstract}
          </Typography>
          <DonationsBalanceMini
            donationIds={cascadeDonationIds}
            fiatTarget={cascadeFiatAmountTarget}>
          </DonationsBalanceMini>
        </CardContent>
        <CardActions className={classes.actions}>
          <Grid
            container
            direction="row"
            spacing={3}>
            <Grid item xs={6} className={classes.actionGridLeft}>
              <Donate
                entityId={campaign.id}
                entityCard={<CampaignCardMini campaign={campaign} />}
                title={t('donateCampaignTitle')}
                description={t('donateCampaignDescription')}
                enabled={campaign.canReceiveFunds}>
              </Donate>
            </Grid>
            <Grid item xs={6} className={classes.actionGridRight}>
              <SecondaryButton
                onClick={this.viewCampaign}>
                {t('openDetail')}
              </SecondaryButton>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

CampaignCard.propTypes = {
  campaign: PropTypes.instanceOf(Campaign).isRequired
};

CampaignCard.defaultProps = {};

const styles = theme => ({
  root: {

  },
  abstract: {
    height: '7em'
  },
  actions: {
    marginTop: '0.5em',
    marginBottom: '1em'
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
    cascadeDonationIds: selectCascadeDonationsByCampaign(state, ownProps.campaign.id),
    cascadeFiatAmountTarget: selectCascadeFiatAmountTargetByCampaign(state, ownProps.campaign.id)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation()(CampaignCard)))
)