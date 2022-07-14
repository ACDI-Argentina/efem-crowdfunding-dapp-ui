import React from 'react';
import SelectFormsy from './SelectFormsy';
import PropTypes from 'prop-types';

import { connect } from 'react-redux'
import { selectUsersByRoles } from '../redux/reducers/usersSlice';


class SelectUsers extends React.Component {

  
  render() {
    const { id, name, label, helpText, value, cta, validations, validationErrors, required } = this.props;
    const { users } = this.props;
    
    const options = users.map(user => ({ ...user, title: user.name, value: user.address }));

    return (
        <SelectFormsy
          id={id}
          name={name}
          label={label}
          helpText={helpText}
          value={value}
          cta={cta}
          options={options}
          validations={validations}
          validationErrors={validationErrors}
          required={required}
        />
    )
  }
}

SelectUsers.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state, props) => {
  return {
    users: selectUsersByRoles(state,props.roles),
  }
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SelectUsers)
