import React from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

const useStyles = makeStyles({
  chip: {
    margin: 2,
  }
});


function CategoryChip(props) {
  const classes = useStyles();
  const { t } = props;
  return (
    <Chip label={t(`category${props.categoryId}Label`)}
      className={classes.chip} />
  );
}

export default withTranslation()(CategoryChip);