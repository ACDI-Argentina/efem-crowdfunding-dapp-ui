import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { selectUserByAddress, fetchUserByAddress } from '../redux/reducers/usersSlice'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ProfileCardAnonymous from './ProfileCardAnonymous';
import AddressLink from './AddressLink';

class ProfileCard extends Component {

    preventDefault = (event) => event.preventDefault();

    componentDidMount() {
        if (this.props.address) {
            this.props.fetchUserByAddress(this.props.address);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.address !== prevProps.address) {
            this.props.fetchUserByAddress(this.props.address);
        }
    }

    render() {
        const { address, user, classes } = this.props;
        if (!user || !user.registered) {
            return (
                <ProfileCardAnonymous address={address} />
            )
        }
        return (
            <ListItem alignItems="flex-start" className={classes.root}>
                <ListItemAvatar>
                    <Avatar src={user.avatarCidUrl} className={classes.logo} />
                </ListItemAvatar>
                <ListItemText
                    primary={user.name}
                    secondary={
                        <React.Fragment>
                            <AddressLink address={address} />
                            <Typography
                                variant="body2"
                                color="textSecondary"
                            >
                                {user.email}
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItem>
        );
    }
}

ProfileCard.propTypes = {
    address: PropTypes.string
};

const styles = theme => ({
    root: {
        padding: '0px'
    },
    inline: {
        display: 'inline',
    },
    logo: {
        width: theme.spacing(6),
        height: theme.spacing(6),
    }
});

const mapStateToProps = (state, props) => {
    return {
        user: selectUserByAddress(state, props.address)
    }
}

const mapDispatchToProps = { fetchUserByAddress }

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(
        withTranslation()(ProfileCard)
    )
);