import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import LoadingOverlay from '../Loading/LoadingOverlay';

class IconPrimaryButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { icon, children, classes, isWorking } = this.props;
    return (
      <LoadingOverlay loading={isWorking}>
        <Button
          color="primary"
          className={classes.root}
          variant="contained"
          size="medium"
          startIcon={icon}
          {...this.props}>
          {children}
        </Button>
      </LoadingOverlay>
    );
  }
}

const styles = theme => ({
  root: {
    border: 'solid',
    borderWidth: '1px',
    borderColor: theme.palette.primary.main,
    borderRadius: "5px",
    boxShadow: `3px 3px 0px 0px ${theme.palette.secondary.main}`,
    textTransform: "none",
    '&:hover': {
      boxShadow: `3px 3px 0px 0px ${theme.palette.secondary.light}`,
      backgroundColor: theme.palette.primary.light
    },
    margin: '0.5em 0px 0.5em 0px',
    minWidth: '8em'
  }
});

IconPrimaryButton.defaultProps = {
  isWorking: false
}

export default withStyles(styles)(IconPrimaryButton);