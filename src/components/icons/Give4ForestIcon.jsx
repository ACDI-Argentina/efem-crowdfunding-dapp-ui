import React from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    height: '100%'
  },
  img: {
    width: '100%'
  }
});

const Give4ForestIcon = (props) => {
  const classes = useStyles();
  return (
    <Icon className={classes.root}>
      <img src={require('assets/img/icons/give4forest-icon.svg')} className={classes.img} />
    </Icon>
  );
};

export default Give4ForestIcon;