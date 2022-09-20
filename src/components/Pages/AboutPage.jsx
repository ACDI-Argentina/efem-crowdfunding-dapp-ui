import React from "react";
import Page from "components/Pages/Page";
import { withTranslation, Trans } from 'react-i18next'
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import aboutBackground from "assets/img/about-background.png";
import visionMisionBackground from "assets/img/vision-mision-background.png";
import aboutWhy1Image from "assets/img/about-why-1-image.png";
import aboutWhy2Image from "assets/img/about-why-2-image.png";
import aboutFeatureFinanciacion from "assets/img/about-feature-financiacion.png";
import aboutFeatureTecnologia from "assets/img/about-feature-tecnologia.png";
import aboutFeatureSolucion from "assets/img/about-feature-solucion.png";
import aboutFeatureDesarrollo from "assets/img/about-feature-desarrollo.png";
import config from "configuration";
import { ipfsService } from "commons";
import Roadmap from "components/views/Roadmap";
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
  header: {
    marginTop: '6em',
    backgroundImage: "url(" + aboutBackground + ")",
    backgroundSize: "cover",
    height: "10em"
  },
  headerGrid: {
    height: "100%"
  },
  subTitle: {
    textTransform: 'uppercase'
  },
  title: {
    marginTop: '0.25em'
  },
  description: {
    marginTop: '2em'
  },
  highlight: {
    color: theme.palette.secondary.main
  },
  textTitle: {
    fontWeight: 600
  },
  visionMision: {
    marginTop: '2em'
  },
  divider: {
    backgroundColor: theme.palette.secondary.main,
    height: '0.25em',
    marginTop: '1em'
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
    padding: '2em 0px 0px 0px',
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
    margin: 'auto',
    marginBottom: '0.5em',
    width: theme.spacing(12),
    height: theme.spacing(12)
  },
  roadmap: {
    marginTop: '3em'
  }
}));

function AboutPage(props) {
  const classes = useStyles();
  const { t, ...rest } = props;
  return (
    <Page>

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
                <Typography variant="subtitle2" className={classes.subTitle}>
                  {t('aboutSubtitle')}
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={8}>
          <Typography variant="h3" className={classes.title}>
            {t('aboutTitle')}
          </Typography>
        </Grid>

        <Grid item xs={8} className={classes.description}>
          <Typography variant="body2">
            <Trans i18nKey="aboutDescription"
              components={{ b: <b className={classes.highlight} /> }} />
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
                <Trans i18nKey="aboutVision" components={{ h3: <h3 className={classes.textTitle} /> }} />
              </Typography>
              <Typography variant="body2">
                <Trans i18nKey="aboutMision" components={{ h3: <h3 className={classes.textTitle} /> }} />
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <img src={visionMisionBackground} style={{ width: '100%' }} />
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
                <Trans i18nKey="aboutWhy1" components={{ h3: <h3 className={classes.textTitle} /> }} />
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <img src={aboutWhy1Image} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={8}>
              <Typography variant="body2">
                <Trans i18nKey="aboutWhy2" components={{ h3: <h3 className={classes.textTitle} /> }} />
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <img src={aboutWhy2Image} style={{ width: '100%' }} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={8} className={classes.team}>
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}>
            <Grid item xs={12} className={classes.teamTitle}>
              <Typography variant="h4">
                {t('aboutUsTeam')}
              </Typography>
            </Grid>

            {config.team.map(member => {
              const photo = ipfsService.resolveUrl(member.photoCid);
              //const photo = ipfsService.resolveUrl('/ipfs/QmeCYvNowpitxcpR2Xs85cykjUksew2kuNJqzzbKL8onxf');
              return (
                <Grid item
                  xs={3}
                  className={classes.teamMember}
                  onClick={() => {
                    window.open(member.link, "_blank");
                  }}>
                  <Avatar alt={member.name}
                    src={photo}
                    className={classes.teamMemberImage} />
                  <Typography variant="subtitle2">
                    {member.name}
                  </Typography>
                  <Typography variant="body2">
                    {member.role}
                  </Typography>
                </Grid>
              )
            })}
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