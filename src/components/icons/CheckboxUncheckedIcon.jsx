import React from 'react';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    height: '100%'
  },
  img: {
    
  }
});

const CheckboxUncheckedIcon = (props) => {
  const classes = useStyles();
  return (
    <Icon className={classes.root}>
      <img src={require('assets/img/icons/checkbox-unchecked-icon.svg')} className={classes.img} />
    </Icon>
  );
};

export default CheckboxUncheckedIcon;