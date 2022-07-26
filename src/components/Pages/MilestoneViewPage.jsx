import React, { Component } from 'react';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import Page from './Page'
import DonationList from '../DonationList'
import DonationsBalance from '../DonationsBalance'
import ProfileCardMini from '../ProfileCardMini'
import CustomTabs from 'components/CustomTabs/CustomTabs';
import TelegramIcon from '@material-ui/icons/Telegram';
import RedditIcon from '@material-ui/icons/Reddit';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import { Avatar } from '@material-ui/core'
import RichTextViewer from 'components/RichTextViewer';
import SupportEntity from 'components/SupportEntity';
import Donate from 'components/Donate';
import MilestoneCardMini from 'components/MilestoneCardMini';
import { selectMilestone } from 'redux/reducers/milestonesSlice';
import { selectCampaign } from 'redux/reducers/campaignsSlice';
import CampaignCard from 'components/CampaignCard';
import MilestoneComplete from 'components/MilestoneComplete';
import MilestoneApprove from 'components/MilestoneApprove';
import MilestoneReject from 'components/MilestoneReject';
import { selectActivitiesByMilestone } from 'redux/reducers/activitiesSlice';
import ActivityList from 'components/ActivityList';
import MilestoneWithdraw from 'components/MilestoneWithdraw';
import StatusIndicator from 'components/StatusIndicator';
import MilestoneCancel from 'components/MilestoneCancel';
import MilestoneEdit from 'components/MilestoneEdit';

/**
 * Visualización de Milestone.
 * 
 */
class MilestoneViewPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const {
      milestone,
      campaign,
      activities,
      classes,
      t } = this.props;

    const tabs = [
      {
        tabIndex: 0,
        tabName: t('milestoneDescriptionTab'),
        tabContent: (
          <RichTextViewer
            value={milestone.description}>
          </RichTextViewer>
        )
      },
      {
        tabIndex: 1,
        tabName: t('milestoneDonationsTab'),
        tabContent: (
          <DonationList
            donationIds={milestone.budgetDonationIds}>
          </DonationList>
        )
      },
      {
        tabIndex: 2,
        tabName: t('milestoneBalanceTab'),
        tabContent: (
          <DonationsBalance
            donationIds={milestone.budgetDonationIds}
            fiatTarget={milestone.fiatAmountTarget}>
          </DonationsBalance>
        )
      },
      {
        tabIndex: 3,
        tabName: t('milestoneParticipantsTab'),
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
                {t('milestoneManager')}
              </Typography>
              <ProfileCardMini address={milestone.managerAddress} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2"
                color="textPrimary"
                gutterBottom>
                {t('milestoneCampaignReviewer')}
              </Typography>
              <ProfileCardMini address={milestone.campaignReviewerAddress} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2"
                color="textPrimary"
                gutterBottom>
                {t('milestoneReviewer')}
              </Typography>
              <ProfileCardMini address={milestone.reviewerAddress} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2"
                color="textPrimary"
                gutterBottom>
                {t('milestoneRecipient')}
              </Typography>
              <ProfileCardMini address={milestone.recipientAddress} />
            </Grid>
          </Grid>
        )
      },
      {
        tabIndex: 4,
        tabName: t('milestoneActivitiesTab'),
        tabContent: (
          <ActivityList activityIds={milestone.activityIds} />
        )
      }
    ];

    function compartirWhatsapp(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("text", "*" + milestone.title + "*\n" + t('campaignShareTitle') + "\n" + window.location.href);
      window.open("https://web.whatsapp.com/send?" + params.toString(), "_blank");
    }

    function compartirReddit(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("title", milestone.title);
      params.append("text", t('milestoneShareTitle') + "\n" + window.location.href);
      window.open("https://www.reddit.com/submit?" + params.toString(), "_blank");
    }

    function compartirTelegram(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("text", milestone.title + ". " + t('milestoneShareTitle'));
      params.append("url", window.location.href);
      window.open("https://telegram.me/share/url?" + params.toString(), "_blank");
    }

    function compartirFacebook(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("u", window.location.href);
      window.open("https://www.facebook.com/sharer/sharer.php?" + params.toString(), "_blank");
    }

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

              <Grid item xs={2} className={classes.headerLeft}>
                <Avatar className={classes.headerAvatar} src={milestone.imageCidUrl} />
              </Grid>

              <Grid item xs={8} className={classes.headerRight}>

                <Typography variant="h5"
                  color="textSecondary">
                  {milestone.title}
                </Typography>

                <Typography variant="subtitle1"
                  color="textSecondary">
                  {milestone.abstract}
                </Typography>

                <Grid container
                  justifyContent="flex-start"
                  alignItems="center"
                  className={classes.socialMediaContainer}>
                  <Grid item xs={1}>
                    <TelegramIcon
                      className={classes.socialMediaIcon}
                      onClick={compartirTelegram} />
                  </Grid>
                  <Grid item xs={1}>
                    <RedditIcon
                      className={classes.socialMediaIcon}
                      onClick={compartirReddit} />
                  </Grid>
                  <Grid item xs={1}>
                    <WhatsAppIcon
                      className={classes.socialMediaIcon}
                      onClick={compartirWhatsapp} />
                  </Grid>
                  <Grid item xs={1}>
                    <FacebookIcon
                      className={classes.socialMediaIcon}
                      onClick={compartirFacebook} />
                  </Grid>
                </Grid>
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
                    <StatusIndicator status={milestone.status}></StatusIndicator>
                  </Grid>

                  <Grid item xs={12}>
                    <SupportEntity
                      title={t('milestoneSupportTitle')}
                      donationIds={milestone.budgetDonationIds}
                      fiatTarget={milestone.fiatAmountTarget}
                      donateButton={
                        <Donate
                          entityId={milestone.id}
                          entityCard={<MilestoneCardMini milestone={milestone} />}
                          title={t('donateMilestoneTitle')}
                          description={t('donatemilestoneDescription')}
                          enabled={milestone.canReceiveFunds}>
                        </Donate>
                      }>
                    </SupportEntity>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2">
                      {t('campaign')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <CampaignCard campaign={campaign} />
                  </Grid>

                  <Grid item xs={12}
                    className={classes.center}>

                    <MilestoneEdit milestone={milestone} />
                    <MilestoneComplete milestone={milestone} />
                    <MilestoneApprove milestone={milestone} />
                    <MilestoneReject milestone={milestone} />
                    <MilestoneWithdraw milestone={milestone} />
                    <MilestoneCancel milestone={milestone} />
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

MilestoneViewPage.contextType = Web3AppContext;

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
  socialMediaContainer: {
    marginTop: '1em'
  },
  socialMediaIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer'
  },
  description: {
    padding: '1em',
  },
  center: {
    textAlign: 'center'
  }
});

const mapStateToProps = (state, ownProps) => {
  const milestoneId = parseInt(ownProps.match.params.id);
  const milestone = selectMilestone(state, milestoneId);
  return {
    currentUser: selectCurrentUser(state),
    milestone: milestone,
    campaign: selectCampaign(state, milestone.campaignId),
    activities: selectActivitiesByMilestone(state, milestoneId)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(MilestoneViewPage)))
);