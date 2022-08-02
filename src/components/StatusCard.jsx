
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Status } from '@acdi/efem-dapp';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

/**
 * Presenta un estado
 */
class StatusCard extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { status, classes, t } = this.props;
        let iconSize = 10;
        let icon = (<CheckCircleOutlineIcon size={iconSize} />);
        if (status.isLocal) {
            icon = (<CircularProgress size={iconSize} color="secondary" />);
        }
        return (
            <Card className={classes.root}>
                <CardHeader
                    className={classes.header}
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {icon}
                        </Avatar>
                    }
                    title={status.name}
                    subheader={t('status')}
                />
            </Card>
        );
    }
}

StatusCard.propTypes = {
    status: PropTypes.instanceOf(Status).isRequired,
};

StatusCard.defaultProps = {

};

const styles = theme => ({
    root: {
        backgroundColor: '#f2f3fa',
        marginTop: '0.5em'
    },
    header: {
        padding: '0.3em'
    },
    avatar: {
        backgroundColor: '#b6bce2'
    }
});

export default withStyles(styles)(
    withTranslation()(StatusCard)
);