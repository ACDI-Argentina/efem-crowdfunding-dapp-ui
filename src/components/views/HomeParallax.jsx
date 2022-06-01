import React, { Component } from 'react';
import styles from "assets/jss/material-kit-react/views/landingPage.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import { Button } from '@material-ui/core';
import { history } from 'lib/helpers'

/**
 * The HomeParallax section
 */
class HomeParallax extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes, t } = this.props;

        return (
            <Parallax image={require("assets/img/landing-bg.jpg")}>
                <div className={classes.container}>
                    <GridContainer justifyContent="center">
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
                                <Button variant="contained" color="primary" className={classes.dropShadowButton} size="sm" onClick={() => this.createDAC()}>
                                    {t('landingPageConocerSoluciones')}
                                </Button>
                                <Button variant="contained" color="tertiary" size="lg" className={classes.dropShadowButton} onClick={() => this.createDAC()}>
                                    {t('landingPageProponerSoluciones')}
                                </Button>
                            </center>
                        </GridItem>
                    </GridContainer>
                </div>
            </Parallax>
        )
    }
}

HomeParallax.propTypes = {};

export default withStyles(styles)(
        withTranslation()(HomeParallax)
    );
