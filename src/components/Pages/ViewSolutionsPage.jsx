import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation, Trans } from 'react-i18next'
import Page from './Page'
import { Grid } from '@material-ui/core'
import Campaigns from 'components/views/Campaigns';

class ViewSolutionsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, t } = this.props;
    return (
      <Page>
        <Grid container
          spacing={0}
          alignItems="center"
          className={classes.container}>
          <Grid item xs={12}>
            <Campaigns />
          </Grid>
        </Grid>
      </Page >
    );
  }
}

ViewSolutionsPage.contextType = Web3AppContext;

const styles = theme => ({
  container: {
    paddingTop: '8em'
  }
});

const mapStateToProps = (state, ownProps) => {

}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(ViewSolutionsPage)))
);