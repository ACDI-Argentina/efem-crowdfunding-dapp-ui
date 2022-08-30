import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from '@material-ui/core/Box';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {   
    
  },
  tab: {
    color: theme.palette.primary.dark,
    textTransform: 'none'
  },
  tabSelected: {
    color: theme.palette.secondary.main,
    
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
      <Tabs
        className={classes.tabs}
        value={value}
        onChange={handleChange}
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
