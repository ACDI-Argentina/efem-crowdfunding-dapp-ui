import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Sponsor from './Sponsor';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '2em 2em 2em 2em'
  },
  tap: {
    color: theme.palette.text.primary
  },
  tapPaper: {
    padding: '1em 0',
    boxShadow: 'rgb(0 0 0 / 45%) 25px 0px 20px -25px, rgb(0 0 0 / 45%) -25px 0px 20px -25px'
  },
  sponsorGrid: {
    textAlign: "center"
  }
}));

export default function Sponsors() {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="full width tabs example"
        centered>
        <Tab label={t('sponsorTap1Title')} {...a11yProps(0)} className={classes.tap} />
        <Tab label={t('sponsorTap2Title')} {...a11yProps(1)} className={classes.tap} />
        <Tab label={t('sponsorTap3Title')} {...a11yProps(2)} className={classes.tap} />
      </Tabs>

      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Grid container
            spacing={0}
            justifyContent="center"
            alignItems="center">
            <Grid item xs={12} sm={6} md={3} className={classes.sponsorGrid}>
              <Sponsor url="https://www.acdi.org.ar"
                logoPath={require("assets/img/logos/acdi.png")}
                name={t('sponsorAcdi')}
                shadowLeft={true}>
              </Sponsor>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.sponsorGrid}>
              <Sponsor url="https://elfuturoestaenelmonte.org"
                logoPath={require("assets/img/logos/el-futuro-esta-en-el-monte.png")}
                name={t('sponsorElFuturoEstaEnElMonte')}>
              </Sponsor>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.sponsorGrid}>
              <Sponsor url="https://bidlab.org"
                logoPath={require("assets/img/logos/IDB-Lab.gif")}
                name={t('sponsorBidlab')}>
              </Sponsor>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.sponsorGrid}>
              <Sponsor url="https://www.rsk.co"
                logoPath={require("assets/img/logos/rsk.svg")}
                name={t('sponsorRsk')}
                shadowRight={true}>
              </Sponsor>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <Grid container
            spacing={0}
            justifyContent="center"
            alignItems="center">
            <Grid item xs={12} sm={6} md={3} className={classes.sponsorGrid}>
              <Sponsor url="https://bidlab.org"
                logoPath={require("assets/img/logos/IDB-Lab.gif")}
                name={t('sponsorBidlab')}
                shadowLeft={true}>
              </Sponsor>
            </Grid>
            <Grid item xs={12} sm={6} md={3} className={classes.sponsorGrid}>
              <Sponsor url="https://www.iovlabs.org"
                logoPath={require("assets/img/logos/iovlabs.jpg")}
                name={t('sponsorIovlabs')}
                shadowRight={true}>
              </Sponsor>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={2} dir={theme.direction}>
          <Grid container
            spacing={0}
            justifyContent="center"
            alignItems="center">
            <Grid item xs={12} sm={6} md={3} className={classes.sponsorGrid}>
              <Sponsor url="https://metamask.io"
                logoPath={require("assets/img/logos/metamask.svg")}
                name={t('sponsorMetamask')}
                shadowLeft={true}
                shadowRight={true}>
              </Sponsor>
            </Grid>
          </Grid>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}