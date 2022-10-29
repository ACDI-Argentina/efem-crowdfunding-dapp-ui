import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import { NavLink } from "react-router-dom";
import LanguageSelector from "components/LanguageSelector";
import { useTranslation } from 'react-i18next';
import { Button } from "@material-ui/core"
import { styled } from "@material-ui/styles"
import { history } from '@acdi/efem-dapp';
import ConnectButton from "components/ConnectButton";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: "flex",
    border: "0",
    borderRadius: "3px",
    padding: "0.625rem 0",
    color: "#FFF",
    width: "100%",
    height: '6em',
    backgroundColor: theme.palette.primary.dark,
    transition: "all 150ms ease 0s",
    alignItems: "center",
    flexFlow: "row nowrap",
    justifyContent: "flex-start",
    position: "relative",
    zIndex: "unset"
  },
  absolute: {
    position: "absolute",
    zIndex: "1100"
  },
  fixed: {
    position: "fixed",
    zIndex: "1100"
  },
  appBarGrid: {
    width: '100%'
  },
  appBarGridLeft: {

  },
  appBarGridCenter: {
    textAlign: 'center'
  },
  appBarGridRight: {
    textAlign: 'right'
  },
  dappLogo: {
    maxHeight: "4em",
    "@media (max-width: 800px)": {
      maxHeight: "3em"
    },
    "@media (max-width: 600px)": {
      maxHeight: "2em"
    }
  },
  title: {
    minWidth: "50%",
    textAlign: "center",
    height: "50px",
  }
}));

export default function Header(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleClickAbout = () => {
    history.push(`/about`);
  };

  const handleClickSolutions = () => {
    history.push(`/view-solutions`);
  };

  const handleClickFAQ = () => {
    history.push(`/faq`);
  };

  const { color, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });

  const dappLogoSrc = require("assets/img/logos/give4forest.svg");

  return (

    <AppBar className={appBarClasses}>

      <Grid container
        className={classes.appBarGrid}
        direction="row"
        justifyContent="center"
        alignItems="center">

        <Grid item xs={3}
          className={classes.appBarGridLeft}>

          <HeaderButton
            variant="text"
            size="small"
            onClick={handleClickAbout}
            sx={{ m: 2, color: 'white', display: 'block' }}
          >
            {t('aboutUs')}
          </HeaderButton>
          <HeaderButton
            variant="text"
            size="small"
            onClick={handleClickSolutions}
            sx={{ m: 2, color: 'white', display: 'block' }}
          >
            {t('solutions')}
          </HeaderButton>
          <HeaderButton
            variant="text"
            size="small"
            onClick={handleClickFAQ}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            {t('faq')}
          </HeaderButton>
        </Grid>

        <Grid item xs={3}
          className={classes.appBarGridCenter}>

          <NavLink className={classes.title} to="/">
            <img src={dappLogoSrc}
              alt={t('give4forest')}
              className={classes.dappLogo} />
          </NavLink>
        </Grid>

        <Grid item xs={3}
          className={classes.appBarGridRight}>

          <Grid container

            direction="row"
            justifyContent="flex-end"
            alignItems="center">

            <Grid item>
              <LanguageSelector></LanguageSelector>
            </Grid>
            <Grid item>
              <ConnectButton />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  );
}

Header.defaultProp = {
  color: "white"
};

const HeaderButton = styled(Button)({
  color: "#FFF",
  textTransform: 'none',
  fontWeight: "normal",
  border: 'none',
  borderRadius: '0px',
  '&:hover': {
    background: 'none',
  },
});

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  fixed: PropTypes.bool,
  absolute: PropTypes.bool
};
