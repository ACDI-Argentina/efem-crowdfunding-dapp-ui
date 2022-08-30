import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { SocialIcon } from 'react-social-icons';
import { Link } from 'react-router-dom';
import { history } from '@acdi/efem-dapp';

/**
 * The Footer section
 */
class Footer extends Component {

  handleClickSoluciones = () => {
    history.push({
      pathname: ``,
      hash: `#campaigns`
    });
  };

  handleClickNews = () => {
    history.push({
      pathname: `/news`
    });
  };

  render() {
    const { classes, t, } = this.props;

    return (
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={0}
        >
          <Grid item xs={1}></Grid>
          <Grid item xs={3} style={{ position: "relative" }}>
            <img src={require("assets/img/logos/give4forestFooter.svg")} alt={t('give4forest')} className={classes.dappLogo} />
          </Grid>
          <Grid item xs={7} style={{ margin: "2em 0", textAlign: "right" }}>
            <Link className={classes.sectionlink} to="/about" underline="always">
              {t('aboutUs')}
            </Link>
            <Link className={classes.sectionlink}
              underline="always"
              onClick={() => this.handleClickSoluciones()}>
              {t('solutions')}
            </Link>
            <Link className={classes.sectionlink}
              underline="always"
              onClick={() => this.handleClickNews()}>
              {t('news')}
            </Link>
            <SocialIcon url="https://twitter.com/Give4Forest"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#FF5D49"
              target="_blank"
              rel="noopener noreferrer" />
            <SocialIcon url="https://www.linkedin.com/company/give4forest"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#FF5D49"
              target="_blank"
              rel="noopener noreferrer" />
            <SocialIcon url="https://t.me/joinchat/et-GV-UFNsdjNzEx"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#FF5D49"
              target="_blank"
              rel="noopener noreferrer" />
            <SocialIcon url="https://medium.com/@give4forest"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#FF5D49"
              target="_blank"
              rel="noopener noreferrer" />
            <SocialIcon url="https://www.instagram.com/giveforforest"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#FF5D49"
              target="_blank"
              rel="noopener noreferrer" />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <center>
              <h6 className={classes.disclaimer}>
                {t('disclaimer')}
                <Link className={classes.link} to="/termsandconditions" target="_blank" underline="always">
                  {t('termsAndConditions')}
                </Link>
                <Link className={classes.link} to="/privacypolicy" target="_blank" underline="always">
                  {t('dataHandlingPolicy')}
                </Link>
              </h6>
            </center>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </div>
    )
  }
}

const styles = (theme) => ({
  root: {
    color: theme.palette.text.secondary,
    padding: "0",
    textAlign: "left",
    backgroundColor: theme.palette.primary.dark,
    marginTop: '4em'
  },
  dappLogo: {
    padding: "1em 0",
    maxHeight: "180px",
    position: "absolute",
    top: "-120px",
    zIndex: "10"
  },
  socialMediaIcon: {
    maxWidth: "30px",
    maxHeight: "30px",
    marginLeft: "20px"
  },
  sectionlink: {
    color: theme.palette.text.secondary,
    textTransform: "uppercase",
    marginRight: "40px",
    fontSize: ".8em",
    "&:hover,&:focus": {
      color: theme.palette.text.secondary
    },
  },
  disclaimer: {
    color: theme.palette.text.secondary,
    fontWeight: "normal",
    padding: "1em",
    textAlign: "center",
    fontSize: ".7em",
    margin: "0",
  },
  link: {
    color: theme.palette.text.secondary,
    "&:hover,&:focus": {
      color: theme.palette.text.secondary
    },
  }
});

Footer.propTypes = {};

export default withTranslation()((withStyles(styles)(Footer)))
