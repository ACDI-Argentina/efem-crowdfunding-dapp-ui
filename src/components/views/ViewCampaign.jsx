import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// nodejs library that concatenates classes
import classNames from "classnames";
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ReactHtmlParser from 'react-html-parser'
import Loader from '../Loader'
import MilestoneCard from '../MilestoneCard'
import { isOwner } from '../../lib/helpers'
import Campaign from '../../models/Campaign'
import CommunityButton from '../CommunityButton'
import DonationList from '../DonationList'
import DonationsBalance from '../DonationsBalance'
import User from '../../models/User'
import ErrorBoundary from '../ErrorBoundary'
import { connect } from 'react-redux'
import { selectCampaign,
  selectCascadeDonationsByCampaign,
  selectCascadeFiatAmountTargetByCampaign } from '../../redux/reducers/campaignsSlice'
import { selectMilestonesByCampaign } from '../../redux/reducers/milestonesSlice'
import ProfileCardMini from '../ProfileCardMini'
import { withTranslation } from 'react-i18next'
import Header from "components/Header/Header.js"
import Footer from "components/Footer/Footer.js"
import Parallax from "components/Parallax/Parallax.js"
import MainMenu from 'components/MainMenu'
import { withStyles } from '@material-ui/core/styles'
import styles from "assets/jss/material-kit-react/views/campaignView.js"
import Typography from '@material-ui/core/Typography'
import { Avatar, Box } from '@material-ui/core'
import OnlyCorrectNetwork from 'components/OnlyCorrectNetwork'
import Grid from '@material-ui/core/Grid';
import CustomTabs from 'components/CustomTabs/CustomTabs';
import SupportCampaignCard from 'components/SupportCampaignCard';

import TelegramIcon from '@material-ui/icons/Telegram';
import RedditIcon from '@material-ui/icons/Reddit';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import DateTimeViewer from 'components/DateTimeViewer';


/**
 * The Campaign detail view mapped to /campaign/id
 *
 * @param currentUser  Currently logged in user information
 * @param history      Browser history object
 */
class ViewCampaign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoadingMilestones: false,
      milestones: props.milestones,
      milestonesLoaded: 0,
      milestonesTotal: 0,
      milestonesPerBatch: 50
    };
  }

  componentDidMount() {
    this.setState({
      campaign: this.props.campaign,
      milestones: this.props.milestones,
      isLoading: false
    });
  }

  /*componentDidMount() {
    this.props.fetchDonationsByIds(this.props.campaign.donationIds);
  }*/

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    /*if (JSON.stringify(this.props.campaign.donationIds) !== JSON.stringify(prevProps.campaign.donationIds)) {
      this.props.fetchDonationsByIds(this.props.campaign.donationIds);
    }*/
  }

  /*removeMilestone(id) {
    checkBalance(this.props.balance)
      .then(() => {
        React.swal({
          title: 'Delete Milestone?',
          text: 'You will not be able to recover this milestone!',
          icon: 'warning',
          dangerMode: true,
        }).then(() => {
          const milestones = feathersClient.service('/milestones');
          milestones.remove(id);
        });
      })
      .catch(err => {
        if (err === 'noBalance') {
          // handle no balance error
        }
      });
  }*/

  render() {
    const { isLoading, isLoadingMilestones, milestonesLoaded, milestonesTotal } = this.state;
    const { classes, campaign, milestones, cascadeDonationIds, cascadeFiatAmountTarget, history, currentUser, t } = this.props;
    const { ...rest } = this.props;

    if (!isLoading && !campaign) return <p>Unable to find a campaign</p>;

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
      params.append("url",  window.location.href);
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
  
    const tabs = [
      {
        tabName: t('campaignDescriptionTab'),
        tabContent: (
          <span>
            <img src={campaign.imageCidUrl} style={{width: '100%', height: 'auto'}} alt="Campaign image" />
            <DateTimeViewer value={campaign.createdAt} style={{textAlign: 'right', marginBottom: '1em' }}/>
            {ReactHtmlParser(campaign.description)}
            {campaign.beneficiaries && (
              <p>
                  {t('campaignBeneficiariesLabel')}: {campaign.beneficiaries}
              </p>
            )}
          </span>
        )
      },
      {
        tabName: t('campaignDonationsTab'),
        tabContent: (
          <span>
            <DonationList donationIds={campaign.budgetDonationIds}></DonationList>
          </span>
        )
      },
      {
        tabName: t('campaignBalanceTab'),
        tabContent: (
          <span>
            <DonationsBalance donationIds={cascadeDonationIds} fiatTarget={cascadeFiatAmountTarget}></DonationsBalance>
          </span>
        )
      },
      {
        tabName: t('campaignRevisorTab'),
        tabContent: (
          <span>
            <ProfileCardMini address={campaign.reviewerAddress} />
          </span>
        )
      }];

    return (
      <ErrorBoundary>
        <div id="view-campaign-view" className={classes.campaignView}>
          {isLoading && <Loader className="fixed" />}

          {!isLoading && (
            <div>
              <Header
                color="white"
                brand={<img src={require("assets/img/logos/give4forest.svg")}
                alt={t('give4forest')}
                className={classes.dappLogo}/>}
                rightLinks={<MainMenu />}
                {...rest}
              />

              <Parallax small image={require("assets/img/icons/campaignBkg.png")} className={classes.parallax}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Avatar alt={campaign.title} className={classes.avatar} src={campaign.imageCidUrl} />
                  </Grid>
                  <Grid item xs={12}>
                    <h2 className={classes.entityName}>{campaign.title}</h2>
                  </Grid>
                  <Grid item xs={12}>
                    {campaign.url && (
                      <div style={{textAlign: 'center'}}>
                        <CommunityButton
                          size="small"
                          color="default"
                          variant="outlined"
                          url={campaign.url}>
                          {t('joinCommunity')}
                        </CommunityButton>
                      </div>
                    )}
                  </Grid>
                </Grid>
              </Parallax>

              <div className={classNames(classes.main, classes.container)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={8}>
                    <CustomTabs
                      plainTabs
                      headerColor="info"
                      customClasses={classes.cardHeader}
                      tabs={tabs}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4}>

                    <Box display="flex" justifyContent="flex-end">
                      <Box m={1}>
                        <Typography variant="h7">
                          {t('campaignShare')}
                        </Typography>
                      </Box>
                      <Box m={1}>
                        <TelegramIcon
                          style={{cursor: "pointer", color: "#279ED1"}}
                          onClick={compartirTelegram} />
                      </Box>
                      <Box m={1}>
                        <RedditIcon
                          style={{cursor: "pointer", color: "#FF4500"}}
                          onClick={compartirReddit} />
                      </Box>
                      <Box m={1}>
                        <WhatsAppIcon
                          style={{cursor: "pointer", color: "#4BDA81"}}
                          onClick={compartirWhatsapp} />
                      </Box>
                      <Box m={1}>
                        <FacebookIcon
                          style={{cursor: "pointer", color: "#4E71A8"}}
                          onClick={compartirFacebook} />
                      </Box>
                    </Box>

                    <Box display="flex">
                      <Box my={1} flexGrow={1}>
                        <Typography variant="h6">
                          {t('campaign')}
                        </Typography>
                      </Box>
                    </Box>
                    <SupportCampaignCard key={campaign.clientId} campaign={campaign} currentUser={currentUser}/>
                  
                    <Box display="flex">
                      <Box my={1} flexGrow={1}>
                        <Typography variant="h6">
                          {t('milestones')}
                        </Typography>
                      </Box>
                      <Box my={1}>
                        {isOwner(campaign.managerAddress, currentUser) && (
                          <OnlyCorrectNetwork>
                            <div>
                              <Link
                                className="btn btn-success btn-sm pull-right"
                                to={`/campaigns/${campaign.id}/milestones/new`}>
                                {t('milestoneAdd')}
                              </Link>
                            </div>
                          </OnlyCorrectNetwork>                                
                        )}
                      </Box>
                    </Box>
                    
                    {isLoadingMilestones && milestonesTotal === 0 && (
                      <Loader className="relative" />
                    )}
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        0: 1,
                        470: 1,
                        900: 1,
                        1200: 1,
                      }}
                    >
                      <Masonry gutter="10px">
                        {milestones.map(m => (
                          <MilestoneCard
                            milestone={m}
                            currentUser={currentUser}
                            key={m.clientId}
                            history={history}
                            removeMilestone={() => this.removeMilestone(m.clientId)}
                          />
                        ))}
                      </Masonry>
                    </ResponsiveMasonry>

                    {milestonesLoaded < milestonesTotal && (
                      <center>
                        <button
                          type="button"
                          className="btn btn-info"
                          onClick={() => this.loadMoreMilestones()}
                          disabled={isLoadingMilestones}
                        >
                          {isLoadingMilestones && (
                            <span>
                              <i className="fa fa-circle-o-notch fa-spin" /> Loading
                            </span>
                          )}
                          {!isLoadingMilestones && <span>Load More</span>}
                        </button>
                      </center>
                    )}
                  </Grid>
                </Grid>
              </div>
            </div>
          )}
          <img src={require("assets/img/icons/separator.png")} alt="" className={classes.bottomSeparator} />
          <Footer />
        </div>
      </ErrorBoundary>
    );
  }
}

ViewCampaign.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired
};

ViewCampaign.defaultProps = {
  currentUser: undefined,
  campaign: new Campaign(),
  milestones: [],
  //donations: []
};

const mapStateToProps = (state, ownProps) => {
  const campaignId = parseInt(ownProps.match.params.id);
  return {
    campaign: selectCampaign(state, campaignId),
    milestones: selectMilestonesByCampaign(state, campaignId),
    cascadeDonationIds: selectCascadeDonationsByCampaign(state, campaignId),
    cascadeFiatAmountTarget: selectCascadeFiatAmountTargetByCampaign(state, campaignId)
  }
}

const mapDispatchToProps = { }

export default connect(mapStateToProps, mapDispatchToProps)(
  (withStyles(styles)(withTranslation() (ViewCampaign)))
)
