import React from 'react';
import { makeStyles } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.primary.main
  }
}));

const LocationIcon = (props) => {
  const classes = useStyles();
  return (
    <RoomIcon className={classes.root} />
  );
};

export default LocationIcon;