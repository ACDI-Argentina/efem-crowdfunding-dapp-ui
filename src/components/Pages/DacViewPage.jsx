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
import StatusIndicator from 'components/StatusIndicator';
import DacCardMini from 'components/DacCardMini';
import CampaignNew from 'components/CampaignNew';
import { selectDac } from 'redux/reducers/dacsSlice';
import { selectCascadeDonationsByDac } from 'redux/reducers/dacsSlice';
import { selectCascadeFiatAmountTargetByDac } from 'redux/reducers/dacsSlice';
import DacEdit from 'components/DacEdit';
import DacTransfer from 'components/DacTransfer';

/**
 * Visualización de DAC.
 * 
 */
class DacViewPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    const {
      dac,
      cascadeDonationIds,
      cascadeFiatAmountTarget,
      classes,
      t } = this.props;

    if (!dac) {
      return null;
    }

    const tabs = [
      {
        tabIndex: 0,
        tabName: t('dacDescriptionTab'),
        tabContent: (
          <RichTextViewer
            value={dac.description}>
          </RichTextViewer>
        )
      },
      {
        tabIndex: 1,
        tabName: t('dacDonationsTab'),
        tabContent: (
          <DonationList
            donationIds={dac.budgetDonationIds}>
          </DonationList>
        )
      },
      {
        tabIndex: 2,
        tabName: t('dacBalanceTab'),
        tabContent: (
          <DonationsBalance
            donationIds={cascadeDonationIds}
            fiatTarget={cascadeFiatAmountTarget}>
          </DonationsBalance>
        )
      },
      {
        tabIndex: 3,
        tabName: t('dacParticipantsTab'),
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
                {t('dacDelegate')}
              </Typography>
              <ProfileCardMini address={dac.delegateAddress} />
            </Grid>
          </Grid>
        )
      }];

    function compartirWhatsapp(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("text", "*" + dac.title + "*\n" + t('dacShareTitle') + "\n" + window.location.href);
      window.open("https://web.whatsapp.com/send?" + params.toString(), "_blank");
    }

    function compartirReddit(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("title", dac.title);
      params.append("text", t('dacShareTitle') + "\n" + window.location.href);
      window.open("https://www.reddit.com/submit?" + params.toString(), "_blank");
    }

    function compartirTelegram(e) {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("text", dac.title + ". " + t('dacShareTitle'));
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

              <Grid item xs={1}>

              </Grid>

              <Grid item xs={2} className={classes.headerLeft}>
                <Avatar className={classes.headerAvatar} src={dac.imageCidUrl} />
              </Grid>

              <Grid item xs={6} className={classes.headerRight}>

                <Typography variant="h5"
                  color="textSecondary">
                  {dac.title}
                </Typography>

                <Typography variant="subtitle1"
                  color="textSecondary">
                  {dac.abstract}
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
                    <StatusIndicator status={dac.status}></StatusIndicator>
                  </Grid>

                  <Grid item xs={12}>
                    <SupportEntity
                      title={t('dacSupportTitle')}
                      donationIds={cascadeDonationIds}
                      fiatTarget={cascadeFiatAmountTarget}
                      donateButton={
                        <Donate
                          entityId={dac.id}
                          entityCard={<DacCardMini dac={dac} />}
                          title={t('donateDacTitle')}
                          description={t('donateDacDescription')}
                          enabled={dac.canReceiveFunds}>
                        </Donate>
                      }>
                    </SupportEntity>
                  </Grid>

                  <Grid item xs={12}
                    className={classes.center}>

                    <DacEdit dac={dac}></DacEdit>
                    <DacTransfer dac={dac}></DacTransfer>
                    <CampaignNew dac={dac}></CampaignNew>
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

DacViewPage.contextType = Web3AppContext;

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
  center: {
    textAlign: 'center'
  }
});

const mapStateToProps = (state, ownProps) => {
  const dacId = parseInt(ownProps.match.params.id);
  return {
    currentUser: selectCurrentUser(state),
    dac: selectDac(state, dacId),
    cascadeDonationIds: selectCascadeDonationsByDac(state, dacId),
    cascadeFiatAmountTarget: selectCascadeFiatAmountTargetByDac(state, dacId)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(DacViewPage)))
);