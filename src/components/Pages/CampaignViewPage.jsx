import React, { Component } from 'react';
import { registerCurrentUser, selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import { history } from 'lib/helpers';
import Page from './Page'
import Background from 'components/views/Background'
import { InputField } from '@acdi/efem-dapp';
import Paper from '@material-ui/core/Paper';
import PrimaryButtonOutline from 'components/buttons/PrimaryButtonOutline';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { ipfsService, validatorUtils } from 'commons';
import { Campaign } from 'models';
import { saveCampaign } from '../../redux/reducers/campaignsSlice';
import RichTextEditor from '../RichTextEditor';
import SelectUsers from 'components/SelectUsers';
import { CAMPAIGN_REVIEWER_ROLE } from '../../constants/Role';
import {
  selectCampaign,
  selectCascadeDonationsByCampaign,
  selectCascadeFiatAmountTargetByCampaign
} from '../../redux/reducers/campaignsSlice'
import { selectMilestonesByCampaign } from '../../redux/reducers/milestonesSlice'
import DateTimeViewer from 'components/DateTimeViewer';
import ReactHtmlParser from 'react-html-parser'
import DonationList from '../DonationList'
import DonationsBalance from '../DonationsBalance'
import ProfileCardMini from '../ProfileCardMini'
import CustomTabs from 'components/CustomTabs/CustomTabs';
import TelegramIcon from '@material-ui/icons/Telegram';
import RedditIcon from '@material-ui/icons/Reddit';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import { Avatar, Box } from '@material-ui/core'
import RichTextViewer from 'components/RichTextViewer';
import FiatTargetProgressCircular from 'components/FiatTargetProgressCircular';
import makeSelectDonationsBalance from '../../redux/selectors/donationsBalanceSelector'
import SupportEntity from 'components/SupportEntity';
import Donate from 'components/Donate';
import CampaignCardMini from 'components/CampaignCardMini';


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

    const { campaign, balances, fiatTarget, cascadeDonationIds, cascadeFiatAmountTarget, classes, t } = this.props;

    const tabs = [
      {
        tabName: t('campaignDescriptionTab'),
        tabContent: (
          <RichTextViewer
            value={campaign.description}>
          </RichTextViewer>
        )
      },
      {
        tabName: t('campaignDonationsTab'),
        tabContent: (
          <DonationList
            donationIds={campaign.budgetDonationIds}>
          </DonationList>
        )
      },
      {
        tabName: t('campaignBalanceTab'),
        tabContent: (
          <DonationsBalance
            donationIds={cascadeDonationIds}
            fiatTarget={cascadeFiatAmountTarget}>
          </DonationsBalance>
        )
      },
      {
        tabName: t('campaignRevisorTab'),
        tabContent: (
          <ProfileCardMini address={campaign.reviewerAddress} />
        )
      }];

    function compartirWhatsapp(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("text", "*" + campaign.title + "*\n" + t('campaignShareTitle') + "\n" + window.location.href);
      window.open("https://web.whatsapp.com/send?" + params.toString(), "_blank");
    }

    function compartirReddit(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("title", campaign.title);
      params.append("text", t('campaignShareTitle') + "\n" + window.location.href);
      window.open("https://www.reddit.com/submit?" + params.toString(), "_blank");
      console.log('Compartir en Reddit.');
    }

    function compartirTelegram(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("text", campaign.title + ". " + t('campaignShareTitle'));
      params.append("url", window.location.href);
      window.open("https://telegram.me/share/url?" + params.toString(), "_blank");
      console.log('Compartir en Telegram.');
    }

    function compartirFacebook(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("u", window.location.href);
      window.open("https://www.facebook.com/sharer/sharer.php?" + params.toString(), "_blank");
      console.log('Compartir en Facebook.');
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
                <Avatar className={classes.headerAvatar} src={campaign.imageCidUrl} />
              </Grid>

              <Grid item xs={8} className={classes.headerRight}>

                <Typography variant="h5"
                  color="textSecondary">
                  {campaign.title}
                </Typography>

                <Typography variant="subtitle1"
                  color="textSecondary">
                  {campaign.abstract}
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
              alignItems="flex-start">

              <Grid item xs={9}>
                <CustomTabs
                  plainTabs
                  headerColor="info"
                  customClasses={classes.cardHeader}
                  tabs={tabs}
                />
              </Grid>

              <Grid item xs={3}>
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
  socialMediaContainer: {
    marginTop: '1em'
  },
  socialMediaIcon: {
    color: theme.palette.primary.main,
    cursor: 'pointer'
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