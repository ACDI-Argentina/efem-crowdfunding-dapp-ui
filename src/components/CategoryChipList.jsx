import React from 'react';
import { makeStyles } from '@material-ui/core';
import CategoryChip from './CategoryChip';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  }
});


function CategoryChipList(props) {
  const classes = useStyles();
  const { categoryIds } = props;
  return (
    <div className={classes.root}>
      {categoryIds.map((categoryId) => (
        <CategoryChip key={categoryId} categoryId={categoryId}></CategoryChip>
      ))}
    </div>
  );
}

export default CategoryChipList;