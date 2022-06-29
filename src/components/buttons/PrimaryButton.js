import React, { Component } from 'react';
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import LoadingOverlay from '../Loading/LoadingOverlay';
import classNames from "classnames";
import {
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor
} from "assets/jss/material-kit-react.js";

class PrimaryButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { children, classes, isWorking, color } = this.props;
    return (
      <LoadingOverlay loading={isWorking}>
        <Button {...this.props}
          color="primary"
          className={classNames(classes.root, classes[color])}
          variant="contained">
          {children}
        </Button>
      </LoadingOverlay>
    );
  }
}

const styles = theme => ({
  root: {
    fontFamily: '"Encode Sans", "Helvetica", "Arial", sans-serif',
    borderRadius: "1.5em",
    margin: "0.5em 0.5em 0.5em 0.5em"
  },
  primary: {
    backgroundColor: primaryColor,
    boxShadow:
      "0 2px 2px 0 rgba(23, 162, 184, 0.14), 0 3px 1px -2px rgba(23, 162, 184, 0.2), 0 1px 5px 0 rgba(23, 162, 184, 0.12)",
    "&:hover,&:focus": {
      backgroundColor: primaryColor,
      boxShadow:
        "0 14px 26px -12px rgba(23, 162, 184, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(23, 162, 184, 0.2)"
    }
  },
  info: {
    backgroundColor: infoColor,
    boxShadow:
      "0 2px 2px 0 rgba(0, 188, 212, 0.14), 0 3px 1px -2px rgba(0, 188, 212, 0.2), 0 1px 5px 0 rgba(0, 188, 212, 0.12)",
    "&:hover,&:focus": {
      backgroundColor: infoColor,
      boxShadow:
        "0 14px 26px -12px rgba(0, 188, 212, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 188, 212, 0.2)"
    }
  },
  success: {
    backgroundColor: successColor,
    boxShadow:
      "0 2px 2px 0 rgba(76, 175, 80, 0.14), 0 3px 1px -2px rgba(76, 175, 80, 0.2), 0 1px 5px 0 rgba(76, 175, 80, 0.12)",
    "&:hover,&:focus": {
      backgroundColor: successColor,
      boxShadow:
        "0 14px 26px -12px rgba(76, 175, 80, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(76, 175, 80, 0.2)"
    }
  },
  warning: {
    backgroundColor: warningColor,
    boxShadow:
      "0 2px 2px 0 rgba(255, 152, 0, 0.14), 0 3px 1px -2px rgba(255, 152, 0, 0.2), 0 1px 5px 0 rgba(255, 152, 0, 0.12)",
    "&:hover,&:focus": {
      backgroundColor: warningColor,
      boxShadow:
        "0 14px 26px -12px rgba(255, 152, 0, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(255, 152, 0, 0.2)"
    }
  },
  danger: {
    backgroundColor: dangerColor,
    boxShadow:
      "0 2px 2px 0 rgba(244, 67, 54, 0.14), 0 3px 1px -2px rgba(244, 67, 54, 0.2), 0 1px 5px 0 rgba(244, 67, 54, 0.12)",
    "&:hover,&:focus": {
      backgroundColor: dangerColor,
      boxShadow:
        "0 14px 26px -12px rgba(244, 67, 54, 0.42), 0 4px 23px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(244, 67, 54, 0.2)"
    }
  }
});

PrimaryButton.defaultProps = {
  color: "primary",
  isWorking: false
}

PrimaryButton.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
  ])
};

export default withStyles(styles)(PrimaryButton);