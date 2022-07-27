import React, { Component } from 'react';
import BigNumber from 'bignumber.js';
import classNames from "classnames";
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import Loader from '../Loader';
import GoBackButton from '../GoBackButton';
import DonationList from '../DonationList';
import CommunityButton from '../CommunityButton';
import CampaignCard from '../CampaignCard';
import DAC from '../../models/DAC';
import ProfileCardMini from '../ProfileCardMini';
import { connect } from 'react-redux'
import { selectCascadeDonationsByDac, selectCascadeFiatAmountTargetByDac, selectDac } from '../../redux/reducers/dacsSlice'
import { selectCampaignsByDac } from '../../redux/reducers/campaignsSlice';
import { fetchDonationsByIds } from '../../redux/reducers/donationsSlice'
import DacCardMini from '../DacCardMini';
import { withTranslation } from 'react-i18next';
import Donate from '../Donate';
import DacTransfer from '../DacTransfer';
import DonationsBalance from '../DonationsBalance';
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { withStyles } from '@material-ui/core/styles';
import styles from "assets/jss/material-kit-react/views/dacView.js";
import { User } from 'models';

import { Avatar, Box } from '@material-ui/core'
/**
 * The DAC detail view mapped to /dac/id
 *
 * @param currentUser  Currently logged in user information
 * @param history      Browser history object
 */
class ViewDAC extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      campaigns: []
    };
  }

  render() {
    const { classes, dac, campaigns, cascadeDonationIds, cascadeFiatAmountTarget, balance, history, currentUser, t } = this.props;
    const {
      isLoading,
      isLoadingCampaigns,
    } = this.state;

    const { ...rest } = this.props;

    if (isLoading) return <Loader className="fixed" />;
    if (!dac) return <div id="view-cause-view">Failed to load dac</div>;
    return (
      <div id="view-cause-view">
        <Header
          color="white"
          brand={<img src={require("assets/img/logos/give4forest.svg")}
          alt={t('give4forest')}
          className={classes.dappLogo}/>}
          rightLinks={<MainMenu />}
          fixed
          changeColorOnScroll={{
            height: 0,
            color: "white"
          }}
          {...rest}
        />
        <Parallax medium>
          <div className={classes.container}>
            <GridContainer justify="center" className={classes.headerContainer}>
              <GridItem xs={12} sm={12} md={12}>
                <Box display="flex" flexGrow={1} alignItems="center">
                  <Box>
                    <Avatar alt={dac.title} className={classes.avatar} src={dac.imageCidUrl} />
                  </Box>
                  <Box m={2} flexGrow={1}>
                    <h6 className={classes.entityType}>{t('dac')}</h6>
                    <h3 className={classes.entityName}>{dac.title}</h3>
                    {dac.url && (
                      <CommunityButton
                        size="small"
                        color="default"
                        variant="outlined"
                        url={dac.url}>
                        {t('joinCommunity')}
                      </CommunityButton>
                    )}
                  </Box>
                  <Box>
                    <div style={{ textAlign: 'center' }}>
                      <Donate
                        entityId={dac.id}
                        entityCard={<DacCardMini dac={dac} />}
                        title={t('donateDacTitle')}
                        description={t('donateDacDescription')}
                        enabled={dac.canReceiveFunds}>
                      </Donate>

                      <DacTransfer dac={dac}></DacTransfer>
  
                      />
                    </div>
                  </Box>
                </Box>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>

        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <GoBackButton to="/" title="Communities" />

                  <ProfileCardMini address={dac.delegateAddress} />

                  <div className="card content-card">
                    <div className="card-body content">{ReactHtmlParser(dac.description)}</div>
                  </div>

                </GridItem>
              </GridContainer>

              {(isLoadingCampaigns || campaigns.length > 0) && (
                <GridContainer justify="center">
                  <GridItem xs={12} sm={12} md={8}>
                  <h4>{campaigns.length} Campaign(s)</h4>
                    <p>These Campaigns are working hard to solve the cause of this Fund </p>
                    {isLoadingCampaigns && <Loader className="small" />}

                    {campaigns.length > 0 && !isLoadingCampaigns && (
                      <div className="cards-grid-container">
                      {campaigns.map(c => (
                        <CampaignCard key={c.id} campaign={c} history={history} balance={balance} />
                      ))}
                      </div>
                    )}
                  </GridItem>
                </GridContainer>
              )}

              <GridContainer justify="center" className="spacer-top-50">
                <GridItem xs={12} sm={12} md={8}>
                  <DonationList donationIds={dac.budgetDonationIds}></DonationList>
                </GridItem>
              </GridContainer>

              <GridContainer justify="center" className="spacer-top-50">
                <GridItem xs={12} sm={12} md={8}>
                  <DonationsBalance donationIds={cascadeDonationIds} fiatTarget={cascadeFiatAmountTarget}></DonationsBalance>
                </GridItem>
              </GridContainer>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

ViewDAC.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  balance: PropTypes.instanceOf(BigNumber).isRequired,
};

ViewDAC.defaultProps = {
  currentUser: undefined,
  dac: new DAC(),
};

const mapStateToProps = (state, ownProps) => {
  const dacId = parseInt(ownProps.match.params.id);
  return {
    dac: selectDac(state, dacId),
    campaigns: selectCampaignsByDac(state, dacId),
    cascadeDonationIds: selectCascadeDonationsByDac(state, dacId),
    cascadeFiatAmountTarget: selectCascadeFiatAmountTargetByDac(state, dacId)
  }
}

const mapDispatchToProps = { fetchDonationsByIds }

export default connect(mapStateToProps, mapDispatchToProps)(
  withTranslation()(withStyles(styles)(ViewDAC))
)