import React, { Component } from 'react';
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { Button } from '@material-ui/core';
import { history } from 'lib/helpers'
import JoinGivethCommunity from 'components/JoinGivethCommunity';


const handleClickAbout = () => {
    history.push(`/about`);
};


/**
 * The HomeParallax section
 */
class HomeParallax extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes, t, history } = this.props;

        return (
            <div className={classes.background}>
                <div className={classes.container}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <div className={classes.titleContainer}>
                                <h2 className={classes.title}>{t('landingPageTitle')}</h2>
                                <h4 className={classes.subtitle}>
                                    {t('landingPagesSubtitle1')}<span className={classes.subtitleHighlight}>{t('landingPagesSubtitle2')}</span>{t('landingPagesSubtitle3')}
                                </h4>
                            </div>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <center>
                                <Button variant="contained" color="primary" className={classes.dropShadowButton} size="medium" onClick={() => handleClickAbout()}>
                                    {t('landingPageConocerSoluciones')}
                                </Button>
                                <Button variant="contained" color="default" size="medium" className={classes.dropShadowButton} onClick={() => handleClickAbout()}>
                                    {t('landingPageProponerSoluciones')}
                                </Button>
                            </center>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={12}>
                            <JoinGivethCommunity history={history} />
                        </GridItem>
                    </GridContainer>
                </div>
            </div>
        )
    }
}

HomeParallax.propTypes = {};

export default withStyles(styles)(
        withTranslation()(HomeParallax)
    );
