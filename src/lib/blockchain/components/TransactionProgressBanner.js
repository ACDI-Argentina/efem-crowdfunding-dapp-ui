import React from "react";
import Link from '@material-ui/core/Link';
import { withTranslation } from 'react-i18next';
import Web3App from '../Web3App'
import { connect } from 'react-redux'
import config from '../../../configuration'
import CircularProgressWithLabel from '../../../components/CircularProgressWithLabel'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

/**
 * https://reactjs.org/docs/state-and-lifecycle.html
 */
class TransactionProgressBanner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      progress: 0
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.calculeProgress(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  calculeProgress() {
    const { transaction } = this.props;
    if (transaction && transaction.submittedTime) {
      let timeDiff = Date.now() - transaction.submittedTime;
      let progress = 0;
      if (timeDiff < config.network.transactionEstimatedTimeMilliseconds) {
        progress = (timeDiff / config.network.transactionEstimatedTimeMilliseconds) * 100;
      } else {
        progress = 100;
      }
      this.setState({
        progress: progress.toFixed()
      });
    }
  }

  render() {
    const { transaction, t } = this.props;
    const { progress } = this.state;
    if (!transaction) {
      return null;
    }
    const preventDefault = (event) => event.preventDefault();
    return (
      <Web3App.Consumer>
        {
          ({
            network
          }) =>
            <Box
              flexDirection="column"
              justifyContent="center"
              alignItems="center">
              <Box my={2}>
                <CircularProgressWithLabel value={progress} />
              </Box>
              <Box my={1}>
                <Typography variant="subtitle1">
                  {t(transaction.pendingTitle.key, transaction.pendingTitle.args)}
                </Typography>
                <Typography variant="caption">
                  {t('transactionEstimatedTimeValue', {
                    transactionEstimatedTime: config.network.transactionEstimatedTime
                  })}
                </Typography>
              </Box>
              <Box my={1}>
                <Link href={config.network.explorer + 'tx/' + transaction.hash} onClick={preventDefault}>
                  <Typography variant="caption">
                    {t('transactionExplore')}
                  </Typography>
                </Link>
              </Box>
            </Box>
        }
      </Web3App.Consumer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = {}

const styles = theme => ({
  
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(TransactionProgressBanner)
  )
);