import React, { Component } from 'react';
import CampaignCard from '../CampaignCard';
import Loader from '../Loader';
import { connect } from 'react-redux'
import { selectCampaigns } from '../../redux/reducers/campaignsSlice'
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import CustomTabsOld from 'components/CustomTabs/CustomTabsOld';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import config from 'configuration';

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

    return (
      <div id="campaigns" className={classes.root}>

        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="flex-end"
          spacing={2}
          className={classes.container}>

          <Grid item xs={8}>
            <Typography variant="h3"
              gutterBottom
              className={classes.title}>
              {t('campaignsTitle')}
            </Typography>
          </Grid>

          <Grid item xs={8}>

            {campaigns.length > 0 && (
              <CustomTabsOld
                plainTabs
                headerColor="info"
                customClasses={classes.cardHeader}
                tabs={[
                  {
                    tabName: t('categoryAllLabel'),
                    tabContent: (
                      <div className={classes.cardsContainer}>
                        {campaigns.map(campaign => (
                          <CampaignCard key={campaign.clientId} campaign={campaign} />
                        ))}
                      </div>
                    )
                  }].concat(config.categories.map(cat => (
                    {
                      tabName: t('category' + cat + 'Label'),
                      tabContent: (
                        <div className={classes.cardsContainer}>
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

            {isLoading && <Loader />}

            {!isLoading && campaigns.length === 0 && (
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
          </Grid>
        </Grid>
      </div>
    )
  }
}


const styles = theme => ({
  root: {

  },
  container: {
    /*padding: "4em 0"*/
  },
  title: {
    color: theme.palette.text.primary,
    fontWeight: 600
  },
  badge: {
    marginLeft: '2em'
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat( auto-fill, minmax(300px, 1fr) )',
    gridGap: '10px',
    width: '100%',
    justifyContent: 'space-around'
  },
  description: {
    color: "#000",
    margin: "0 auto 1em auto",
    fontWeight: "normal"
  },
  cardHeader: {
    width: "auto",
    border: "0",
    padding: "5px 2px",
    textAlign: "center",
    marginTop: "0px",
    marginLeft: "0px",
    marginRight: "0px",
    marginBottom: "15px",
    background: "none",
    borderRadius: "0",
    "flexContainer": {
      display: "flex",
      flexWrap: "space-around"
    },
  }
});

Campaigns.propTypes = {};

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: selectCampaigns(state)
  }
}

export default connect(mapStateToProps)(
  withTranslation()((withStyles(styles)(Campaigns))
  ))
