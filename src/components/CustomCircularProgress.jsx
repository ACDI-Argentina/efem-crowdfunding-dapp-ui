import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid'

const styles = (theme) => ({
  root: {

  },
  bottom: {
    color: theme.palette.grey[200],
  },
  top: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round'
  },
});

const useStyles = makeStyles(styles);

function CircularProgressWithLabel(props) {
  const classes = useStyles();
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        {...props}
        className={classes.bottom}
        value={100}
      />
      <CircularProgress
        {...props}
        className={classes.top}
        classes={{
          circle: classes.circle,
        }} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center">

        <Grid
          container
          justifyContent="center"
          alignItems="center">
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant="subtitle2">
              {`${Math.round(props.value)}%`}
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant="body2">
              {props.label}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired
};

export default function CustomCircularProgress(props) {
  const { value, label, ...rest } = props;
  const classes = useStyles();
  return (
    <CircularProgressWithLabel
      value={value}
      label={label}
      size="10em"
      thickness={5}
      variant="determinate"
    />
  );
}