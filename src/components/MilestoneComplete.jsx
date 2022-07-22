import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'formsy-react-components';
import Milestone from '../models/Milestone';
import MilestoneProof from './MilestoneProof';
import Activity from '../models/Activity';
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
import { complete } from '../redux/reducers/milestonesSlice';
import MilestoneCardMini from './MilestoneCardMini';
import { User } from '@acdi/efem-dapp';
import TextField from '@material-ui/core/TextField';
import DoneIcon from '@material-ui/icons/Done';
import OnlyCorrectNetwork from './OnlyCorrectNetwork';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice'
import IconPrimaryButton from './buttons/IconPrimaryButton';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class MilestoneComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsValid: false,
      activity: new Activity({}),
      open: false
    };
    this.form = React.createRef();
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.handleChangeItems = this.handleChangeItems.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  handleClickOpen() {
    this.setState({
      open: true
    });
  };

  handleClose() {
    this.setState({
      open: false
    });
  };

  handleComplete() {
    const { milestone, currentUser } = this.props;
    const { activity } = this.state;
    milestone.status = Milestone.COMPLETING;
    activity.action = Activity.ACTION_COMPLETE;
    activity.userAddress = currentUser.address;
    this.props.complete({
      milestone,
      activity
    });
    this.setState({
      open: false
    });
  };

  handleChangeMessage(event) {
    const { activity } = this.state;
    activity.message = event.target.value;
    this.setState({
      activity: activity
    });
    this.checkForm();
  };

  handleChangeItems(items) {
    const { activity } = this.state;
    activity.items = items;
    this.setState({
      activity: activity
    });
    this.checkForm();
  };

  checkForm() {
    const { activity } = this.state;
    const formIsValid = activity.message != '' && activity.items.length > 0;
    this.setState({
      formIsValid: formIsValid
    });
  };

  render() {
    const {
      activity,
      formIsValid,
      open
    } = this.state;
    const { milestone, currentUser, classes, t } = this.props;

    let isEnabled = false;
    if (milestone.isManager(currentUser) && milestone.canComplete()) {
      isEnabled = true;
    }

    return (
      <div>
        {isEnabled && (
          <OnlyCorrectNetwork>
            <IconPrimaryButton
              icon={<DoneIcon />}
              onClick={this.handleClickOpen}>
              {t('milestoneComplete')}
            </IconPrimaryButton>
          </OnlyCorrectNetwork>
        )
        }
        <Dialog fullWidth={true}
          maxWidth="md"
          open={open}
          onClose={this.handleClose}
          TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {t('milestoneCompleteTitle')}
              </Typography>
              <Button autoFocus
                color="inherit"
                onClick={this.handleComplete}
                disabled={!formIsValid}>
                {t('milestoneComplete')}
              </Button>
            </Toolbar>
          </AppBar>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <MilestoneCardMini milestone={milestone} />
              </Grid>
              <Grid item xs={8}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      {t('milestoneCompleteDescription')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Form id="activity"
                      ref={this.form}
                      layout="vertical">
                      <div>
                        <TextField
                          id="message"
                          name="message"
                          value={activity.message}
                          label={t('message')}
                          placeholder={t('milestoneCompleteMessagePlaceholder')}
                          multiline
                          rows={5}
                          autoFocus
                          margin="dense"
                          type="text"
                          fullWidth
                          required
                          onChange={this.handleChangeMessage}
                        />
                        <MilestoneProof
                          isEditMode
                          items={activity.items}
                          onItemsChanged={items => this.handleChangeItems(items)}
                          milestoneStatus={milestone.status}
                        />
                      </div>
                    </Form>
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

MilestoneComplete.propTypes = {
  milestone: PropTypes.instanceOf(Milestone).isRequired,
  currentUser: PropTypes.instanceOf(User).isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: '1em'
  },
  appBar: {
    position: 'relative'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  button: {
    margin: theme.spacing(0.5),
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  }
}

const mapDispatchToProps = { complete }

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(MilestoneComplete)
  )
);
