import { Component } from 'react';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';

class OnlyRole extends Component {

    render() {
        const currentUser = this.props.currentUser;
        const role = this.props.role;
        if (currentUser.roles.includes(role)) {
            return this.props.children;
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state, ownProps) => (
    {
        currentUser: selectCurrentUser(state)
    }
);

export default connect(mapStateToProps, {})(OnlyRole);