import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { withStyles } from '@material-ui/core/styles';

class ProfileCardMiniAnonymous extends Component {

    render() {
        const { address, namePosition, classes, t } = this.props;
        const descriptionClass = namePosition === "left" || namePosition === "right" ? "" : "small";
        return (
            <div>
                <Link className={`profile-card ${namePosition}`} to={`/profile/${address}`}>
                    <Avatar src={require("assets/img/default-user-icon.png")} className={classes.logo} />
                    <p className={`description ${descriptionClass}`}>
                        {t('userAnonymous')}
                    </p>
                </Link>
            </div>
        );
    }
}

ProfileCardMiniAnonymous.propTypes = {
    address: PropTypes.string,
    namePosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

ProfileCardMiniAnonymous.defaultProps = {
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

    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(
        withTranslation()(ProfileCardMiniAnonymous)
    )
);