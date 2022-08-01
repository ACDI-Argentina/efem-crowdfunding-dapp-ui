import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import Page from './Page'
import Background from 'components/views/Background'
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

/**
 * Visualización de FAQ.
 * 
 */
class FaqPage extends Component {

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
            <Grid item xs={4}>
              <Typography variant="h5" gutterBottom>
                {t('faqTitle')}
              </Typography>
              <Typography variant="subtitle2">
                {t('faqSubtitle1')}
              </Typography>
              <Typography variant="subtitle2" color="secondary">
                {t('faqSubtitle2')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Paper className={classes.faqPanel}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('faq1Question')}
                </Typography>
                <Typography variant="body2">
                  {t('faq1Answer')}
                </Typography>
              </Paper>

              <Paper className={classes.faqPanel}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('faq2Question')}
                </Typography>
                <Typography variant="body2">
                  {t('faq2Answer')}
                </Typography>
              </Paper>
              
              <Paper className={classes.faqPanel}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('faq3Question')}
                </Typography>
                <Typography variant="body2">
                  {t('faq3Answer')}
                </Typography>
              </Paper>
              
              <Paper className={classes.faqPanel}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('faq4Question')}
                </Typography>
                <Typography variant="body2">
                  {t('faq4Answer')}
                </Typography>
              </Paper>
              
              <Paper className={classes.faqPanel}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('faq5Question')}
                </Typography>
                <Typography variant="body2">
                  {t('faq5Answer')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Background>
      </Page >
    );
  }
}

FaqPage.contextType = Web3AppContext;

const styles = theme => ({
  faqPanel: {
    marginBottom: '2em',
    padding: '1em'
  }
});

const mapStateToProps = (state, ownProps) => {

}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(FaqPage)))
);