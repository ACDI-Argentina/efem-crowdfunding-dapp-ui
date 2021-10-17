import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Campaign from '../models/Campaign'
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
import Typography from '@material-ui/core/Typography'
import Donate from './Donate'
import CampaignCardMini from './CampaignCardMini'
import Grid from '@material-ui/core/Grid'

import { Box } from '@material-ui/core'
import EditCampaignButton from './EditCampaignButton'
import TransferCampaign from './TransferCampaign'


class SupportCampaignCard extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { cascadeDonationIds, cascadeFiatAmountTarget, t, classes, campaign, currentUser } = this.props;

    return (
      <Card
        className={classes.root}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2">
              {t('supportCampaign')}
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
            container
            direction="row"
            justifyContent="flex-end"
          >
            <Grid item xs={12} className={classes.actions}>
              <Box display="flex" flexGrow={1} alignItems="center" justifyContent="flex-end">
                <Box>
                  <div style={{textAlign: 'right'}}>
                    <Donate
                      entityId={campaign.id}
                      entityCard={<CampaignCardMini campaign={campaign} />}
                      title={t('donateCampaignTitle')}
                      description={t('donateCampaignDescription')}
                      enabled={campaign.canReceiveFunds}>
                    </Donate>
                    <TransferCampaign campaign={campaign}></TransferCampaign>
                    <EditCampaignButton 
                      currentUser={currentUser}
                      campaign={campaign}
                      title={t('donateCampaignTitle')}
                      >
                    </EditCampaignButton>
                  </div>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

SupportCampaignCard.propTypes = {
  campaign: PropTypes.instanceOf(Campaign).isRequired
};

SupportCampaignCard.defaultProps = {};

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
    cascadeDonationIds: selectCascadeDonationsByCampaign(state, ownProps.campaign.id),
    cascadeFiatAmountTarget: selectCascadeFiatAmountTargetByCampaign(state, ownProps.campaign.id)
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation()(SupportCampaignCard)))
)