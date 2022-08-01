import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { history } from '@acdi/efem-dapp';
import JoinGivethCommunity from 'components/JoinGivethCommunity';
import PrimaryButton from 'components/buttons/PrimaryButton';
import SecondaryButton from 'components/buttons/SecondaryButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { container } from "assets/jss/material-kit-react.js";
import parallaxBkg from "assets/img/landing-bg.jpg";

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
        const { classes, t } = this.props;

        return (
            <div className={classes.background}>
                <div className={classes.container}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12}>
                            <div className={classes.titleContainer}>
                                <Typography variant="h3"
                                    className={classes.title}>
                                    {t('landingPageTitle')}
                                </Typography>

                                <Typography variant="subtitle1"
                                    className={classes.subtitle}>
                                    {t('landingPagesSubtitle1')}<span className={classes.textHighlight}>{t('landingPagesSubtitle2')}</span>{t('landingPagesSubtitle3')}
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>

                            <Grid container
                                justifyContent="center"
                                spacing={2}>

                                <Grid item>
                                    <PrimaryButton onClick={() => handleClickAbout()}>
                                        {t('landingPageConocerSoluciones')}
                                    </PrimaryButton>
                                </Grid>
                                <Grid item>
                                    <SecondaryButton onClick={() => handleClickAbout()}>
                                        {t('landingPageProponerSoluciones')}
                                    </SecondaryButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <JoinGivethCommunity/>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

const styles = theme => ({
    background: {
        backgroundImage: "url(" + parallaxBkg + ")",
        backgroundSize: "cover",
        height: "100vh"
    },
    container: {
        zIndex: "12",
        color: "#FFFFFF",
        ...container
    },
    titleContainer: {
        padding: "3em",
        paddingTop: "10em",
        "@media (max-width: 600px)": {
            padding: "1em",
        }
    },
    title: {
        margin: "0 10%",
        textAlign: "center",
        fontWeight: "600"
    },
    subtitle: {
        textAlign: "center",
        margin: "1rem 20%"
    },
    textHighlight: {
        color: theme.palette.primary.main
    }
});

HomeParallax.propTypes = {};

export default withStyles(styles)(
    withTranslation()(HomeParallax)
);
