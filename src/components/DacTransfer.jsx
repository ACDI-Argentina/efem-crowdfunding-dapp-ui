import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux'
import { User } from '@acdi/efem-dapp';
import DAC from 'models/DAC';
import FastForwardIcon from '@material-ui/icons/FastForward';
import config from '../configuration';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { fetchDonationsByIds, transferDonations } from '../redux/reducers/donationsSlice'
import DonationItemTransfer from './DonationItemTransfer';
import CampaignSelector from './CampaignTransferSelector';
import TransferMilestoneSelector from './TransferMilestoneSelector';
import DacCard from './DacCard';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class DacTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      amount: 0,
      checked: [],
      left: props.dac.budgetDonationIds,
      right: [],
      milestoneIds: []
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.setChecked = this.setChecked.bind(this);
    this.numberOfChecked = this.numberOfChecked.bind(this);
    this.union = this.union.bind(this);
    this.setLeft = this.setLeft.bind(this);
    this.setRight = this.setRight.bind(this);
    this.handleCheckedRight = this.handleCheckedRight.bind(this);
    this.handleCheckedLeft = this.handleCheckedLeft.bind(this);
    this.onChangeCampaign = this.onChangeCampaign.bind(this);
    this.onChangeMilestone = this.onChangeMilestone.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(prevProps.dac.budgetDonationIds) !== JSON.stringify(this.props.dac.budgetDonationIds)) {
      this.props.fetchDonationsByIds(this.props.dac.budgetDonationIds);
      this.setState({
        left: this.props.dac.budgetDonationIds
      });
    }
  }

  handleTransfer() {
    const { campaign, milestone, right } = this.state;
    const { dac, transferDonations } = this.props;
    let entityIdTo = campaign.id;
    if (milestone) {
      entityIdTo = milestone.id;
    }
    transferDonations({
      userAddress: dac.delegate,
      entityIdFrom: dac.id,
      entityIdTo: entityIdTo,
      donationIds: right
    });
    this.close();
  };

  not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  union(a, b) {
    return [...a, ...this.not(b, a)];
  }

  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setChecked(newChecked);
  };

  setChecked(checked) {
    this.setState({
      checked: checked
    });
  }

  setLeft(left) {
    this.setState({
      left: left
    });
  }

  setRight(right) {
    this.setState({
      right: right
    });
  }

  numberOfChecked(items) {
    const { checked } = this.state;
    return this.intersection(checked, items).length;
  }

  handleToggleAll = (items) => () => {
    const { checked } = this.state;
    if (this.numberOfChecked(items) === items.length) {
      this.setChecked(this.not(checked, items));
    } else {
      this.setChecked(this.union(checked, items));
    }
  };

  handleCheckedRight() {
    const { checked, left, right } = this.state;
    let leftChecked = this.intersection(checked, left);
    this.setRight(right.concat(leftChecked));
    this.setLeft(this.not(left, leftChecked));
    this.setChecked(this.not(checked, leftChecked));
  };

  handleCheckedLeft() {
    const { checked, left, right } = this.state;
    let rightChecked = this.intersection(checked, right);
    this.setLeft(left.concat(rightChecked));
    this.setRight(this.not(right, rightChecked));
    this.setChecked(this.not(checked, rightChecked));
  };

  handleClickOpen() {
    this.open();
  };

  handleClose() {
    this.close();
  };

  open() {
    this.setState({
      open: true
    });
  }

  close() {
    this.setState({
      open: false
    });
  }

  onChangeCampaign(campaign) {
    let milestoneIds = [];
    if (campaign) {
      milestoneIds = campaign.milestoneIds;
    }
    this.setState({
      campaign: campaign,
      milestoneIds: milestoneIds
    });
  }

  onChangeMilestone(milestone) {
    this.setState({
      milestone: milestone
    });
  }

  customList(title, items) {
    const { checked, left, right } = this.state;
    const { classes, t } = this.props;
    return (
      <Card>
        <CardHeader
          className={classes.cardHeader}
          avatar={
            <Checkbox
              onClick={this.handleToggleAll(items)}
              checked={this.numberOfChecked(items) === items.length && items.length !== 0}
              indeterminate={this.numberOfChecked(items) !== items.length && this.numberOfChecked(items) !== 0}
              disabled={items.length === 0}
              inputProps={{ 'aria-label': 'all items selected' }}
            />
          }
          title={title}
          subheader={`${this.numberOfChecked(items)}/${items.length} ${t('countSelected')}`}
        />
        <Divider />
        <List className={classes.list} dense component="div" role="list">
          {items.map((donationId) => {
            return (
              <DonationItemTransfer
                key={donationId}
                donationId={donationId}
                handleToggle={this.handleToggle}
                isChecked={checked.indexOf(donationId) !== -1}>
              </DonationItemTransfer>
            );
          })}
          <ListItem />
        </List>
      </Card>
    );
  }

  render() {
    const { open, checked, left, right, campaign, milestoneIds } = this.state;
    const { dac, currentUser, classes, t } = this.props;

    let leftChecked = this.intersection(checked, left);
    let rightChecked = this.intersection(checked, right);

    let transferIsValid = false;
    if (campaign && right.length > 0) {
      transferIsValid = true;
    }

    let buttonEnabled = true;

    return (
      <div>
        {buttonEnabled && (
          <OnlyCorrectNetwork>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<FastForwardIcon />}
              onClick={this.handleClickOpen}
            >
              {t('transfer')}
            </Button>
          </OnlyCorrectNetwork>
        )}
        <Dialog fullWidth={true}
          maxWidth="lg"
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {t('transferDacTitle')}
              </Typography>
              <Button autoFocus
                color="inherit"
                onClick={this.handleTransfer}
                disabled={!transferIsValid}>
                {t('transfer')}
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                {<DacCard dac={dac} />}
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('transferDacDescription')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <CampaignSelector
                      campaignIds={dac.campaignIds}
                      onChange={this.onChangeCampaign}>
                    </CampaignSelector>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TransferMilestoneSelector
                      milestoneIds={milestoneIds}
                      onChange={this.onChangeMilestone}>
                    </TransferMilestoneSelector>
                  </Grid>

                  <Grid container spacing={2} justify="center" alignItems="center" className={classes.transferList}>
                    <Grid item xs={5}>{this.customList(t('donationsAvailables'), left)}</Grid>
                    <Grid item xs={2}>
                      <Grid container direction="column" alignItems="center">
                        <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={this.handleCheckedRight}
                          disabled={leftChecked.length === 0}
                          aria-label="move selected right"
                        >
                          &gt;
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={this.handleCheckedLeft}
                          disabled={rightChecked.length === 0}
                          aria-label="move selected left"
                        >
                          &lt;
                      </Button>
                      </Grid>
                    </Grid>
                    <Grid item xs={5}>{this.customList(t('donationsToTransfer'), right)}</Grid>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </div>
        </Dialog>
      </div >
    );
  }
}

DacTransfer.propTypes = {
  currentUser: PropTypes.instanceOf(User).isRequired,
  dac: PropTypes.instanceOf(DAC).isRequired,
  tokenAddress: PropTypes.string.isRequired
};

DacTransfer.defaultProps = {
  tokenAddress: config.nativeToken.address
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '1em'
  },
  amount: {
    width: '100%',
    marginTop: '1em'
  },
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  button: {
    margin: theme.spacing(1),
  },
  /*root: {
    margin: 'auto',
  },*/
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    height: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  toSelectors: {
    flexGrow: 1
  },
  transferList: {
    flexGrow: 1,
    marginTop: '1em'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = { fetchDonationsByIds, transferDonations }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(DacTransfer)
  )
);