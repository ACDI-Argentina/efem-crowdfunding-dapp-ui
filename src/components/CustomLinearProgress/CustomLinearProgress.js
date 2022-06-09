import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
// core components
import styles from "assets/jss/material-kit-react/components/customLinearProgressStyle.js";

const useStyles = makeStyles(styles);

export default function CustomLinearProgress(props) {
  const { color, value, ...rest } = props;
  const classes = useStyles({ value });
  return (
    <LinearProgress
      {...rest}
      classes={{
        root: classes.root,
        bar: classes.bar + " " + classes[color]
      }}
    />
  );
}

CustomLinearProgress.defaultProps = {
  color: "gray"
};

CustomLinearProgress.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "warning",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ])
};
