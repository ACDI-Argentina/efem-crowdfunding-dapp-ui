import React, { Component } from 'react';
// @material-ui/core components

import CampaignCard from '../CampaignCard';
import Loader from '../Loader';
import { connect } from 'react-redux'
import { selectCampaigns } from '../../redux/reducers/campaignsSlice'
import { withTranslation } from 'react-i18next';

import styles from "assets/jss/material-kit-react/views/landingPageSections/campaignsStyle.js";
import { withStyles } from '@material-ui/core/styles';

import Badge from "components/Badge/Badge.js";
import CustomTabs from 'components/CustomTabs/CustomTabs';
import { ALL_CATEGORIES } from 'constants/Categories';

/**
 * The Campaigns view mapped to /campaigns
 */
class Campaigns extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };

  }

  render() {
    const { classes, t, campaigns } = this.props;
    const { isLoading, hasError } = this.state;

    // TODO Por incorporación de Redux, se fija el total
    // como el tamaño de las campañas.
    // Falta el desarrollo del Paginado.
    var total = campaigns.length;
    
    return (
      <div id="campaigns-view" className="card-view">
        <div className={classes.section}>
          <h3 className={classes.title}>{t('campaigns')} {total > 0 && <Badge color="success">{total}</Badge>}</h3>
          <h6 className={classes.description}>
            {t('campaignsSectionDescription')}
          </h6>
          {// There are some Campaigns in the system, show them
          !hasError && campaigns.length > 0 && (
            <CustomTabs
              plainTabs
              headerColor="info"
              customClasses={classes.cardHeader}
              tabs={[
                {
                  tabName: t('campaignCategoriesAllLabel'),
                  tabContent: (
                    <div className="cards-grid-container">
                      {campaigns.map(campaign => (
                        <CampaignCard key={campaign.clientId} campaign={campaign} />
                      ))}
                    </div>
                  )
                }].concat(ALL_CATEGORIES.map(cat => (
                  {
                  tabName: t('campaignCategories' + cat + 'Label'),
                  tabContent: (
                    <div className="cards-grid-container">
                      {campaigns
                        .filter(campaign => campaign.categories.indexOf(cat) !== -1)
                        .map(campaign => (<CampaignCard key={campaign.clientId} campaign={campaign} />
                      ))}
                    </div>
                  )
                })))
              }
            />
          )}
          {!hasError && isLoading && <Loader />}

          {// There are no Campaigns, show empty state
          !hasError && !isLoading && campaigns.length === 0 && (
            <div>
              <center>
                <p className={classes.description}>{t('noCampaignsYet')}</p>
                <img
                  className="empty-state-img"
                  src={`${process.env.PUBLIC_URL}/img/campaign.svg`}
                  width="200px"
                  height="200px"
                  alt="no-campaigns-icon"
                />
              </center>
            </div>
          )}
          {hasError && (
            <p>
              <strong>Ups, algo fall&oacute;...</strong> La dapp no pudo cargar las Campa&ntilde;as
              por alguna raz&oacute;n. Intenta recargar la p&aacute;gina...
            </p>
          )}
        </div>
      </div>
    )
  }
}

Campaigns.propTypes = {};

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: selectCampaigns(state)
  }
}

export default connect(mapStateToProps)(
  withTranslation()((withStyles(styles)(Campaigns))
))
