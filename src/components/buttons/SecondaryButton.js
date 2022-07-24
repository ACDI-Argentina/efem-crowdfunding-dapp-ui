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
    color: theme.palette.secondary.main,
    border: 'solid',
    borderWidth: '1px',
    borderColor: theme.palette.secondary.main,
    borderRadius: "5px",
    boxShadow: `3px 3px 0px 0px ${theme.palette.primary.main}`,
    textTransform: "none",
    '&:hover': {
      boxShadow: `3px 3px 0px 0px ${theme.palette.primary.light}`
    },
    margin: '0.5em 0px 0.5em 0px'
  }
});

SecondaryButton.defaultProps = {
  isWorking: false
}

export default withStyles(styles)(SecondaryButton);