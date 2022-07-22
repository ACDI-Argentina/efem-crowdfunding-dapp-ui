import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { selectUserByAddress, fetchUserByAddress } from '../redux/reducers/usersSlice'
import ProfileCardMiniAnonymous from './ProfileCardMiniAnonymous';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
import { web3Utils } from 'commons';
import { history } from '../lib/helpers'
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import { ipfsService } from 'commons';

class ProfileCardMini extends Component {

    constructor(props) {
        super(props);
        this.viewUser = this.viewUser.bind(this);
    }

    viewUser() {
        history.push(`/profile/${this.props.user.address}`);
    }

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
            return null;
        }
        if (!user.registered) {
            return (
                <ProfileCardMiniAnonymous address={user.address} />
            )
        }
        const avatarSrc = ipfsService.resolveUrl(user.avatarCid);
        return (
            <Card className={classes.root}>
                <CardActionArea onClick={this.viewUser}>
                    <CardHeader
                        title={
                            user.name
                        }
                        subheader={
                            <Typography variant="caption" noWrap>
                                {web3Utils.abbreviateAddress(user.address)}
                            </Typography>
                        }
                        avatar={
                            <Avatar src={avatarSrc}
                                className={classes.avatar}>
                            </Avatar>
                        }>
                    </CardHeader>
                </CardActionArea>
            </Card>
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
    root: {
        /*minWidth: 275,*/
    },
    avatar: {
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