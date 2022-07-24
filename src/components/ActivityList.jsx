import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Activity from '../models/Activity';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ActivityItem from './ActivityItem';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import { fetchActivitiesByIds, selectActivitiesByIds } from '../redux/reducers/activitiesSlice'
import { connect } from 'react-redux';

class ActivityList extends Component {

  componentDidMount() {
    this.props.fetchActivitiesByIds(this.props.activityIds);
  }

  render() {
    const { activities, classes, t } = this.props;

    if (activities.length == 0) {
      return (
        <Typography variant="body2">
          {t('activitiesEmpty')}
        </Typography>
      );
    }

    return (
      <List className={classes.root}>
        {activities.map(activity => (
          <ActivityItem key={activity.clientId} activity={activity}></ActivityItem>
        ))}
      </List>
    );
  }
}

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.instanceOf(Activity)).isRequired
};

const styles = {
  root: {
    width: '100%'
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    activities: selectActivitiesByIds(state, ownProps.activityIds)
  };
}
const mapDispatchToProps = {
  fetchActivitiesByIds
}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(ActivityList)))
);
