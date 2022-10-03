import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import LoadingOverlay from '../Loading/LoadingOverlay';

class TertiaryButton extends Component {

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
    color: theme.palette.common.white,
    border: 'solid',
    borderWidth: '1px',
    backgroundColor: theme.palette.primary.dark,
    borderColor: theme.palette.primary.dark,
    borderRadius: "5px",
    boxShadow: `3px 3px 0px 0px ${theme.palette.secondary.main}`,
    textTransform: "none",
    '&:hover': {
      boxShadow: `3px 3px 0px 0px ${theme.palette.secondary.light}`,
      color: theme.palette.primary.dark,
    },
    margin: '0.5em 0px 0.5em 0px',
    minWidth: '8em',
    fontSize: '0.9em'
  }
});

TertiaryButton.defaultProps = {
  isWorking: false
}

export default withStyles(styles)(TertiaryButton);