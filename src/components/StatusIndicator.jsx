
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Status } from '@acdi/efem-dapp';
import Chip from '@material-ui/core/Chip';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Presenta un estado
 */
class StatusIndicator extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let status = this.props.status;
        let iconSize = 10;
        let icon = (<CheckCircleOutlineIcon size={iconSize} />);
        if (status.isLocal) {
            icon = (<CircularProgress size={iconSize} />);
        }
        return (
            <Chip size="small"
                variant="outlined"
                label={status.name}
                color="primary"
                icon={icon}
            />
        );
    }
}

StatusIndicator.propTypes = {
    status: PropTypes.instanceOf(Status).isRequired,
};

StatusIndicator.defaultProps = {

};

export default StatusIndicator;