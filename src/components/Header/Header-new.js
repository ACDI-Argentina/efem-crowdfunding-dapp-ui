import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Hidden from "@material-ui/core/Hidden"
import Drawer from "@material-ui/core/Drawer"
import styles from "assets/jss/material-kit-react/components/headerStyle.js"
import { NavLink } from "react-router-dom"
import ConnectButton from "components/ConnectButton"
import LanguageSelector from "components/LanguageSelector"
import MenuIcon from '@material-ui/icons/Menu'
import InfoIcon from '@material-ui/icons/Info';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import { history } from 'lib/helpers'
import { useTranslation } from 'react-i18next';
import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core"
import { styled } from "@material-ui/styles"

const useStyles = makeStyles(styles);

export default function Header(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [setMenuAnchorEl] = React.useState(null);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [setAnchorElUser] = React.useState(null);

  const handleClickAbout = () => {
    history.push(`/about`);
  };

  const handleClickFAQ = () => {
    history.push(`/faq`);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const goUsers = () => {
    setMenuAnchorEl(null);
    history.push(`/users`);
  };

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

        <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
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
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Box m={1}>
            <HeaderButton
              variant="text"
              size="small"
              onClick={handleClickAbout}
              sx={{ m: 2, color: 'white', display: 'block' }}
            >
              {t('aboutAvalDAOTitle')}
            </HeaderButton>
          </Box>
          <Box m={1}>
            <HeaderButton
              variant="text"
              size="small"
              onClick={handleClickFAQ}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {t('faqTitle')}
            </HeaderButton>
          </Box>
        </Box>

        <LanguageSelector></LanguageSelector>

        <ConnectButton />

        {/*<Hidden mdUp>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            {<Menu />}
          </IconButton>
        </Hidden>*/}

        <Box sx={{mr: 2, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="small"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            <MenuItem onClick={
              handleClickAbout
            }>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary={t('aboutAvalDAOTitle')} />
            </MenuItem>
            <MenuItem onClick={
              handleClickFAQ
            }>
              <ListItemIcon>
                <LiveHelpIcon />
              </ListItemIcon>
              <ListItemText primary={t('faqTitle')} />
            </MenuItem>
          </Menu>
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
  textTransform: 'none',
  borderBottom: '1px solid #FFF',
  borderRadius: '0px',
  '&:hover': {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #CCC',
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
