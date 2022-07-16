import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const styles = (theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[200]
  },
  bar: () => ({
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
  })
});

const useStyles = makeStyles(styles);

function LinearProgressWithLabel(props) {
  const classes = useStyles();
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          {...props}
          classes={{
            root: classes.root,
            colorPrimary: classes.colorPrimary,
            bar: classes.bar
          }}
        />
      </Box>
      <Box minWidth={35} style={{ textAlign: 'right' }}>
        <Typography variant="subtitle2" color="textPrimary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function CustomLinearProgress(props) {
  return (
    <LinearProgressWithLabel
      value={props.value}
      variant="determinate" />
  );
}