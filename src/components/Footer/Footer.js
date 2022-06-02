import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import styles from "assets/jss/material-kit-react/views/landingPageSections/footerStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { SocialIcon } from 'react-social-icons';
import { Link } from 'react-router-dom';

/**
 * The Footer section
 */
class Footer extends Component {

  render() {
    const { classes, t, } = this.props;

    return (
      <div className={classes.section}>
        <Grid
          container
          direction="row"
          justifyContent="center"
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
            <Link className={classes.sectionlink} to="/" underline="always">
              {t('solutions')}
            </Link>
            <Link className={classes.sectionlink} to="/" underline="always">
              {t('news')}
            </Link>
            {/*<SocialIcon url="https://www.facebook.com/ACDIargentina%20/"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />*/}
            {/*<SocialIcon url="https://www.instagram.com/acdiargentina/"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />*/}
            {/*<SocialIcon url="https://twitter.com/ACDIargentina"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />*/}
            {/*<SocialIcon url="https://www.linkedin.com/company/acdiargentina"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#7868E5"
              target="_blank" rel="noopener noreferrer" />*/}
            <SocialIcon url="https://twitter.com"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#FF5D49"
              target="_blank" rel="noopener noreferrer" />
            <SocialIcon url="https://www.linkedin.com"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#FF5D49"
              target="_blank" rel="noopener noreferrer" />
            <SocialIcon url="https://telegram.org"
              className={classes.socialMediaIcon}
              bgColor="#FFF"
              color="#FF5D49"
              target="_blank" rel="noopener noreferrer" />
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

Footer.propTypes = {};

export default withTranslation()((withStyles(styles)(Footer)))
