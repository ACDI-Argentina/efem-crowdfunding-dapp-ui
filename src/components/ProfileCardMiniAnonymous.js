import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import { web3Utils } from 'commons';

class ProfileCardMiniAnonymous extends Component {

    render() {
        const { address, classes, t } = this.props;
        return (
            <Card className={classes.root}>
                <CardActionArea>
                    <CardHeader
                        title={
                            t('userAnonymous')
                        }
                        subheader={
                            <Typography variant="caption" noWrap>
                                {web3Utils.abbreviateAddress(address)}
                            </Typography>
                        }
                        avatar={
                            <Avatar src={require("assets/img/default-user-icon.png")}
                                className={classes.avatar}>
                            </Avatar>
                        }>
                    </CardHeader>
                </CardActionArea>
            </Card>
        );
    }
}

ProfileCardMiniAnonymous.propTypes = {
    address: PropTypes.string
};

ProfileCardMiniAnonymous.defaultProps = {
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

    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(
        withTranslation()(ProfileCardMiniAnonymous)
    )
);