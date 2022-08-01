import React from "react";
import Page from "components/Pages/Page";
import { withTranslation, Trans } from 'react-i18next'
import { Grid, Link } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import aboutBackground from "assets/img/about-background.png";
import visionMisionBackground from "assets/img/vision-mision-background.png";
import aboutFeatureFinanciacion from "assets/img/about-feature-financiacion.png";
import aboutFeatureTecnologia from "assets/img/about-feature-tecnologia.png";
import aboutFeatureSolucion from "assets/img/about-feature-solucion.png";
import aboutFeatureDesarrollo from "assets/img/about-feature-desarrollo.png";
import config from "configuration";
import { ipfsService } from "commons";
import Roadmap from "components/views/Roadmap";

const useStyles = makeStyles(theme => ({
  header: {
    backgroundImage: "url(" + aboutBackground + ")",
    backgroundSize: "cover",
    height: "10em"
  },
  headerGrid: {
    height: "100%"
  },
  title: {
    marginTop: '0.5em'
  },
  description: {
    marginTop: '2em'
  },
  visionMision: {
    marginTop: '2em'
  },
  visionMisionRigth: {
    backgroundImage: "url(" + visionMisionBackground + ")",
    backgroundSize: "cover",
    height: "20em"
  },
  features: {
    marginTop: '3em'
  },
  featureGrid: {
    textAlign: 'center'
  },
  featureImage: {
    width: '6em'
  },
  why: {
    marginTop: '3em',
    padding: '2em 0px 2em 0px',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white
  },
  team: {
    marginTop: '3em'
  },
  teamTitle: {
    textAlign: 'center'
  },
  teamMember: {
    textAlign: 'center',
    margin: '1em'
  },
  teamMemberImage: {
    width: '10em'
  },
  roadmap: {
    marginTop: '3em'
  }
}));

function AboutPage(props) {
  const classes = useStyles();
  const { t, ...rest } = props;
  return (
    <Page showHeader={false}>


      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="flex-start">

        <Grid item xs={12}>
          <div className={classes.header}>
            <Grid container
              direction="row"
              justifyContent="center"
              alignItems="flex-end"
              className={classes.headerGrid}>
              <Grid item xs={8}>
                <Typography variant="subtitle2">
                  {t('aboutSubtitle')}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={8} className={classes.title}>
          <Typography variant="h4">
            {t('aboutTitle')}
          </Typography>
        </Grid>

        <Grid item xs={8} className={classes.description}>
          <Typography variant="body2">
            <Trans i18nKey="aboutDescription" />
          </Typography>
        </Grid>

        <Grid item xs={8} className={classes.visionMision}>
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <Trans i18nKey="aboutVision" components={{ h4: <h4 /> }} />
              </Typography>
              <Typography variant="body2">
                <Trans i18nKey="aboutMision" components={{ h4: <h4 /> }} />
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.visionMisionRigth}>

            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={8} className={classes.features}>
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={4}>
            <Grid item xs={6} className={classes.featureGrid}>
              <img src={aboutFeatureFinanciacion} className={classes.featureImage} />
              <Typography variant="subtitle2">
                {t('aboutFeatureFinanciacion')}
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.featureGrid}>
              <img src={aboutFeatureTecnologia} className={classes.featureImage} />
              <Typography variant="subtitle2">
                {t('aboutFeatureTecnologia')}
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.featureGrid}>
              <img src={aboutFeatureSolucion} className={classes.featureImage} />
              <Typography variant="subtitle2">
                {t('aboutFeatureSolucion')}
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.featureGrid}>
              <img src={aboutFeatureDesarrollo} className={classes.featureImage} />
              <Typography variant="subtitle2">
                {t('aboutFeatureDesarrollo')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className={classes.why}>
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={4}>
            <Grid item xs={8}>
              <Typography variant="body2">
                <Trans i18nKey="aboutWhy" components={{ h4: <h4 /> }} />
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={8} className={classes.team}>
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={4}>
            <Grid item xs={12} className={classes.teamTitle}>
              <Typography variant="h4">
                {t('aboutUsTeam')}
              </Typography>
            </Grid>

            {config.team.primary.map(member => {
              const photo = ipfsService.resolveUrl(member.photoCid);
              return (
                <Grid item xs={2} className={classes.teamMember}>
                  <img src={photo} className={classes.teamMemberImage} />
                  <Typography variant="subtitle2">
                    {member.name}
                  </Typography>
                  <Typography variant="body2">
                    {member.role}
                  </Typography>
                </Grid>
              )
            })}

            <Grid item xs={12}></Grid>

            {config.team.secondary.map(member => (
              <Grid item xs={2} className={classes.teamMember}>
                <Typography variant="subtitle2">
                  {member.name}
                </Typography>
                <Typography variant="body2">
                  {member.role}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={8} className={classes.roadmap}>
          <Roadmap></Roadmap>
        </Grid>
      </Grid>
    </Page >
  );
};

export default withTranslation()(AboutPage);