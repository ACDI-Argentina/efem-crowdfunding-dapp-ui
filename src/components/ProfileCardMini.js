import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { selectUserByAddress, fetchUserByAddress } from '../redux/reducers/usersSlice'
import ProfileCardMiniAnonymous from './ProfileCardMiniAnonymous';
import { withStyles } from '@material-ui/core/styles';

class ProfileCardMini extends Component {  //va a recibir como prop un address
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
        const { user, namePosition, classes } = this.props;
        const descriptionClass = namePosition === "left" || namePosition === "right" ? "" : "small";
        if (!user) {
            return (
                <div></div>
            )
        }
        if (!user.registered) {
            return (
                <ProfileCardMiniAnonymous address={user.address} />
            )
        }
        return (
            <div>
                <Link className={`profile-card ${namePosition}`} to={`/profile/${user.address}`}>
                    <Avatar src={user.avatarCidUrl} className={classes.logo} /> 
                    <p className={`description ${descriptionClass}`}>{user.name}</p>
                </Link>
            </div>
        );
    }
}

ProfileCardMini.propTypes = {
    address: PropTypes.string,
    namePosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

ProfileCardMini.defaultProps = {
    namePosition: 'bottom'
};

const styles = theme => ({
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
        withTranslation()(ProfileCardMini)
    )
);