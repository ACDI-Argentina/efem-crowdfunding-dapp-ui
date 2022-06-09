import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getTruncatedText, history } from '../lib/helpers'
import Campaign from '../models/Campaign'
import messageUtils from '../redux/utils/messageUtils'
import { withStyles } from '@material-ui/core/styles'
import { withTranslation } from 'react-i18next'
import StatusCard from './StatusCard'
import { selectCascadeDonationsByCampaign, selectCascadeFiatAmountTargetByCampaign } from '../redux/reducers/campaignsSlice'
import DonationsBalanceMini from './DonationsBalanceMini'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Donate from './Donate'
import CampaignCardMini from './CampaignCardMini'
import Grid from '@material-ui/core/Grid'
import { dropShadowButton } from 'assets/jss/material-kit-react/components/customButtonStyle'
import { Button } from '@material-ui/core'

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
    const { cascadeDonationIds, cascadeFiatAmountTarget, t, classes, campaign } = this.props;

    return (
      <Card
        className={classes.root}>
        <CardActionArea onClick={this.viewCampaign}>
          <CardMedia
            component="img"
            height="150"
            image={campaign.imageCidUrl}
          />
          <CardContent>
            <Typography style={{ fontWeight: 600 }} gutterBottom variant="h6" component="h2">
              {getTruncatedText(campaign.title, 40)}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.description}>
              {getTruncatedText(campaign.description, 200)}
            </Typography>
            <DonationsBalanceMini
              donationIds={cascadeDonationIds}
              fiatTarget={cascadeFiatAmountTarget}>
            </DonationsBalanceMini>
            <StatusCard status={campaign.status} />
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Grid
            xs={12}
            container
            direction="row"
            style={{ justifyContent: "center" }}>
              <span>
                <Donate
                  entityId={campaign.id}
                  entityCard={<CampaignCardMini campaign={campaign} />}
                  title={t('donateCampaignTitle')}
                  description={t('donateCampaignDescription')}
                  enabled={campaign.canReceiveFunds}>
                </Donate>
              </span>
              <span>
                <Button variant="contained" color="default" size="md" className={classes.dropShadowButton} onClick={this.viewCampaign}>
                  {t('openDetail')}
                </Button>
              </span>
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
  description: {
    height: '7em'
  },
  actions: {
    textAlign: 'right'
  },
  dropShadowButton: {
    ...dropShadowButton,
    margin: ".5em"
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