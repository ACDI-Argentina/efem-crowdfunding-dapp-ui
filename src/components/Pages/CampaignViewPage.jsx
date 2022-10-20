import React, { Component } from 'react';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import Page from './Page'
import {
  selectCampaign,
  selectCascadeDonationsByCampaign,
  selectCascadeFiatAmountTargetByCampaign
} from '../../redux/reducers/campaignsSlice'
import { selectMilestonesByCampaign } from '../../redux/reducers/milestonesSlice'
import DonationList from '../DonationList'
import DonationsBalance from '../DonationsBalance'
import ProfileCardMini from '../ProfileCardMini'
import CustomTabs from 'components/CustomTabs/CustomTabs';
import { Avatar } from '@material-ui/core'
import RichTextViewer from 'components/RichTextViewer';
import SupportEntity from 'components/SupportEntity';
import Donate from 'components/Donate';
import CampaignCardMini from 'components/CampaignCardMini';
import MilestoneCard from 'components/MilestoneCard';
import CampaignTransfer from 'components/CampaignTransfer';
import StatusIndicator from 'components/StatusIndicator';
import MilestoneNew from 'components/MilestoneNew';
import CampaignEdit from 'components/CampaignEdit';
import CategoryChipList from 'components/CategoryChipList';
import { SocialIcon } from 'react-social-icons';

/**
 * Visualización de Campaign.
 * 
 */
class CampaignViewPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const {
      campaign,
      cascadeDonationIds,
      cascadeFiatAmountTarget,
      milestones,
      classes,
      t } = this.props;

    if (!campaign) {
      return null;
    }

    const tabs = [
      {
        tabIndex: 0,
        tabName: t('campaignDescriptionTab'),
        tabContent: (
          <div>
            <CategoryChipList categoryIds={campaign.categories}></CategoryChipList>
            <RichTextViewer
              value={campaign.description}>
            </RichTextViewer>
          </div>
        )
      },
      {
        tabIndex: 1,
        tabName: t('campaignDonationsTab'),
        tabContent: (
          <DonationList
            donationIds={campaign.budgetDonationIds}>
          </DonationList>
        )
      },
      {
        tabIndex: 2,
        tabName: t('campaignBalanceTab'),
        tabContent: (
          <DonationsBalance
            donationIds={cascadeDonationIds}
            fiatTarget={cascadeFiatAmountTarget}>
          </DonationsBalance>
        )
      },
      {
        tabIndex: 3,
        tabName: t('campaignParticipantsTab'),
        tabContent: (
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}>

            <Grid item xs={12}>
              <Typography variant="subtitle2"
                color="textPrimary"
                gutterBottom>
                {t('campaignManager')}
              </Typography>
              <ProfileCardMini address={campaign.managerAddress} />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2"
                color="textPrimary"
                gutterBottom>
                {t('campaignReviewer')}
              </Typography>
              <ProfileCardMini address={campaign.reviewerAddress} />
            </Grid>

            

          </Grid>
        )
      }];

    return (
      <Page>

        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={6}>

          <Grid item xs={12} className={classes.header}>

            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="center">

              <Grid item xs={1}>

              </Grid>

              <Grid item xs={2} className={classes.headerLeft}>
                <Avatar className={classes.headerAvatar} src={campaign.imageCidUrl} />
              </Grid>

              <Grid item xs={6} className={classes.headerRight}>

                <Typography variant="h5"
                  color="textSecondary">
                  {campaign.title}
                </Typography>

                <Typography variant="subtitle1"
                  color="textSecondary">
                  {campaign.abstract}
                </Typography>

                <SocialIcon url={campaign.url}
                  className={classes.socialMediaIcon}
                  bgColor="#FFF"
                  color="#FF5D49"
                  target="_blank"
                  rel="noopener noreferrer" />
              </Grid>

              <Grid item xs={3}>

              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={10}>

            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={3}>

              <Grid item xs={9}>
                <CustomTabs
                  plainTabs
                  headerColor="info"
                  customClasses={classes.cardHeader}
                  tabs={tabs}
                />
              </Grid>

              <Grid item xs={3}>

                <Grid container
                  direction="row"
                  justifyContent="center"
                  alignItems="flex-start"
                  spacing={3}>

                  <Grid item xs={12}
                    className={classes.center}>
                    <StatusIndicator status={campaign.status}></StatusIndicator>
                  </Grid>

                  <Grid item xs={12}>
                    <SupportEntity
                      title={t('campaignSupportTitle')}
                      donationIds={cascadeDonationIds}
                      fiatTarget={cascadeFiatAmountTarget}
                      donateButton={
                        <Donate
                          entityId={campaign.id}
                          entityCard={<CampaignCardMini campaign={campaign} />}
                          title={t('donateCampaignTitle')}
                          description={t('donateCampaignDescription')}
                          enabled={campaign.canReceiveFunds}>
                        </Donate>
                      }>
                    </SupportEntity>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2">
                      {t('milestonesTitle')}
                    </Typography>
                  </Grid>

                  {milestones.length === 0 && (
                    <Typography variant="body2">
                      {t('milestonesEmpty')}
                    </Typography>
                  )}

                  {milestones.map(milestone => (
                    <Grid item xs={12}>
                      <MilestoneCard
                        key={milestone.clientId}
                        milestone={milestone}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}
                    className={classes.center}>

                    <CampaignEdit campaign={campaign}></CampaignEdit>
                    <CampaignTransfer campaign={campaign}></CampaignTransfer>
                    <MilestoneNew campaign={campaign}></MilestoneNew>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Page >
    );
  }
}

CampaignViewPage.contextType = Web3AppContext;

const styles = theme => ({
  header: {
    backgroundColor: theme.palette.primary.dark,
    padding: '0px !important'
  },
  headerLeft: {
    paddingTop: '7em'
  },
  headerRight: {
    padding: '9em 0px 2em 0px'
  },
  headerAvatar: {
    width: '6em',
    height: '6em',
    margin: 'auto'
  },
  socialMediaIcon: {
    marginTop: '1em',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    maxWidth: '2em',
    maxHeight: '2em'
  },
  center: {
    textAlign: 'center'
  }
});

const mapStateToProps = (state, ownProps) => {
  const campaignId = parseInt(ownProps.match.params.id);
  return {
    currentUser: selectCurrentUser(state),
    campaign: selectCampaign(state, campaignId),
    milestones: selectMilestonesByCampaign(state, campaignId),
    cascadeDonationIds: selectCascadeDonationsByCampaign(state, campaignId),
    cascadeFiatAmountTarget: selectCascadeFiatAmountTargetByCampaign(state, campaignId)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(CampaignViewPage)))
);