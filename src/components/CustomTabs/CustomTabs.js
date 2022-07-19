import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Icon from "@material-ui/core/Icon";
// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    backgroundColor: theme.palette.secondary.light,
  },
  tab: {
    color: theme.palette.secondary.dark,
  },
  tabSelected: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.dark
  },
  tabBox: {
    paddingTop: '1em'
  }
});

const useStyles = makeStyles(styles);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.tabBox}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function CustomTabs(props) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, value) => {
    setValue(value);
  };
  const classes = useStyles();
  const { tabs } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static"
        className={classes.tabs}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          centered
        >

          {tabs.map((prop, key) => {
            return (
              <Tab
                key={key}
                label={prop.tabName}
                classes={{
                  root: classes.tab,
                  selected: classes.tabSelected
                }}
              />
            );
          })}
        </Tabs>
      </AppBar>

      {tabs.map((prop, key) => {
        if (key === value) {
          return (
            <TabPanel index={prop.tabIndex} value={value}>
              {prop.tabContent}
            </TabPanel>
          );
        }
      })}
    </div>
  );
}

CustomTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabIndex: PropTypes.number.isRequired,
      tabName: PropTypes.string.isRequired,
      tabContent: PropTypes.node.isRequired
    })
  )
};
