import React, { useContext } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// core components
import styles from "assets/jss/material-kit-react/components/headerStyle.js";
import { NavLink } from "react-router-dom";
import Connect from "components/Connect";
import LanguageSelector from "components/LanguageSelector";
import { useTranslation } from 'react-i18next';
import { Box, Button, Menu } from "@material-ui/core"
import { styled } from "@material-ui/styles"
import { history } from 'lib/helpers'


const useStyles = makeStyles(styles);

export default function Header(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => {
    if (props.changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (props.changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  });
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClickAbout = () => {
    history.push(`/about`);
  };

  const handleClickFAQ = () => {
    history.push(`/faq`);
  };

  const headerColorChange = () => {
    const { color, changeColorOnScroll } = props;
    const windowsScrollTop = window.pageYOffset;
    if (windowsScrollTop > changeColorOnScroll.height) {
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[changeColorOnScroll.color]);
    } else {
      document.body
        .getElementsByTagName("header")[0]
        .classList.add(classes[color]);
      document.body
        .getElementsByTagName("header")[0]
        .classList.remove(classes[changeColorOnScroll.color]);
    }
  };
  const { color, rightLinks, leftLinks, brand, fixed, absolute } = props;
  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed
  });
  const brandComponent = <NavLink className={classes.title} to="/">
    {brand}
  </NavLink>;

  return (

    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
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
            onClick={handleClickFAQ}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            {t('faqTitle')}
          </HeaderButton>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        </Box>
        <Box minWidth="40%" textAlign="center" sx={{ flexGrow: 1, display: { md: 'flex' } }}>
            {leftLinks !== undefined ? brandComponent : null}
            {<div className={classes.flex}>
              {leftLinks !== undefined ? (
                <Hidden smDown implementation="css">
                  {leftLinks}
                </Hidden>
              ) : (
                brandComponent
              )}
            </div>}
        </Box>
        <Box sx={{ display: { md: 'flex' } }}>
          <LanguageSelector></LanguageSelector>
        </Box>
        <Box sx={{ display: { md: 'flex' } }}>
          <Connect />
        </Box>
        <Box sx={{ display: { md: 'flex' } }}>
        <Hidden smDown implementation="css">
          {rightLinks}
        </Hidden>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Hidden>
        </Box>


      </Toolbar>

      <Hidden mdUp implementation="js">
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={handleDrawerToggle}
        >
          <div className={classes.appResponsive}>
            {leftLinks}
            {rightLinks}
          </div>
        </Drawer>
      </Hidden>
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
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
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
    ]).isRequired
  })
};
