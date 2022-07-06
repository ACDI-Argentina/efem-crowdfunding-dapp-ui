import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import LoadingOverlay from '../Loading/LoadingOverlay';

class SecondaryButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { children, classes, isWorking } = this.props;
    return (
      <LoadingOverlay loading={isWorking}>
        <Button {...this.props}
          color="secondary"
          className={classes.root}
          variant="outlined">
          {children}
        </Button>
      </LoadingOverlay>
    );
  }
}

const styles = theme => ({
  root: {
    borderRadius: "5px",
    textTransform: "none"
  }
});

SecondaryButton.defaultProps = {
  isWorking: false
}

SecondaryButton.propTypes = {

};

export default withStyles(styles)(SecondaryButton);