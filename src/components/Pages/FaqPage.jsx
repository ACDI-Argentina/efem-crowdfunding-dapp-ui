import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation, Trans } from 'react-i18next'
import Page from './Page'
import Background from 'components/views/Background'
import { Typography } from '@material-ui/core';
import { Grid, Link } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
          <Grid container spacing={2}>

            <Grid item xs={12}>
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

            <Grid item xs={12}>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="faq1-content"
                  id="faq1-header">
                  <Typography className={classes.question}>
                    {t('faq1Question')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    <Trans i18nKey="faq1Answer"
                      components={{ br: <br />, ul: <ul />, li: <li /> }} />
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="faq2-content"
                  id="faq2-header">
                  <Typography className={classes.question}>
                    {t('faq2Question')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    <Trans i18nKey="faq2Answer"
                      components={{
                        linkRsk: <Link href={"https://www.rsk.co/es/faqs"}>RSK</Link>,
                        br: <br />, ul: <ul />, li: <li />
                      }} />
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="faq3-content"
                  id="faq3-header">
                  <Typography className={classes.question}>
                    {t('faq3Question')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    {t('faq3Answer')}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="faq4-content"
                  id="faq4-header">
                  <Typography className={classes.question}>
                    {t('faq4Question')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    {t('faq4Answer')}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="faq5-content"
                  id="faq5-header">
                  <Typography className={classes.question}>
                    {t('faq5Question')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    <Trans i18nKey="faq5Answer"
                      components={{
                        linkGive4ForestDoc: <Link href={"https://github.com/ACDI-Argentina/give-4-forest/wiki/give-4-forest-definition"}>Give4Forest Doc</Link>,
                        br: <br />, ul: <ul />, li: <li />
                      }} />
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="faq6-content"
                  id="faq6-header">
                  <Typography className={classes.question}>
                    {t('faq6Question')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    {t('faq6Answer')}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Background>
      </Page >
    );
  }
}

FaqPage.contextType = Web3AppContext;

const styles = theme => ({
  question: {
    color: theme.palette.secondary.main
  }
});

const mapStateToProps = (state, ownProps) => {

}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(FaqPage)))
);