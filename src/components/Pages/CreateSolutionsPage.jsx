import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation, Trans } from 'react-i18next'
import Page from './Page'
import Background from 'components/views/Background'
import { Typography } from '@material-ui/core';
import { Grid, Link } from '@material-ui/core'

class CreateSolutionsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, t } = this.props;
    return (
      <Page>
        <Background>
          <Grid container spacing={1} style={{ padding: "2em" }}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                {t('createSolutionsTitle')}
              </Typography>
              <Typography variant="body2">
                {t('createSolutionsDescription')}
              </Typography>
            </Grid>
          </Grid>
        </Background>
      </Page >
    );
  }
}

CreateSolutionsPage.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {

}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(CreateSolutionsPage)))
);