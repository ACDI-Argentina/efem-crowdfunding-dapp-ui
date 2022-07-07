import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import LoadingOverlay from '../Loading/LoadingOverlay';

class PrimaryButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { children, classes, isWorking } = this.props;
    return (
      <LoadingOverlay loading={isWorking}>
        <Button {...this.props}
          color="primary"
          className={classes.root}
          variant="contained"
          size="medium">
          {children}
        </Button>
      </LoadingOverlay>
    );
  }
}

const styles = theme => ({
  root: {
    borderRadius: "5px",
    boxShadow: `3px 3px 0px 0px ${theme.palette.secondary.main}`,
    textTransform: "none",
    '&:hover': {
      boxShadow: `3px 3px 0px 0px ${theme.palette.secondary.light}`,
      backgroundColor: theme.palette.primary.light
    }
  }
});

PrimaryButton.defaultProps = {
  isWorking: false
}

export default withStyles(styles)(PrimaryButton);