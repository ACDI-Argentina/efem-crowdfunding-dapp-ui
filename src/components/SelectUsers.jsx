import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux'
import { selectUsersByRoles } from '../redux/reducers/usersSlice';
import { ipfsService, web3Utils } from 'commons';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

class SelectUsers extends Component {

  render() {
    const { id, label, value, onChange, helperText, users, classes, t } = this.props;

    if (users.length === 0) {
      // No hay usuarios para seleccionar.
      return (
        <Typography variant="subtitle1">
          {t('selectUsersEmpty')}
        </Typography>
      )
    }

    let userOptions = users.map(user => {
      const avatarSrc = ipfsService.resolveUrl(user.avatarCid);
      return (
        <MenuItem key={user.address} value={user.address}>
          <Grid container
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
            className={classes.option}>
            <Grid item xs={2}>
              <Avatar src={avatarSrc} />
            </Grid>
            <Grid item xs={10}>
              <Typography variant="subtitle1" noWrap>
                {user.name}
              </Typography>
              <Typography variant="caption" noWrap>
                {web3Utils.abbreviateAddress(user.address)}
              </Typography>
            </Grid>
          </Grid>
        </MenuItem>)
    }

    );

    return (
      <FormControl className={classes.root}>
        <InputLabel id={`select-users-${id}-label`}>
          {label}
        </InputLabel>
        <Select
          id={`select-users-${id}`}
          labelId={`select-users-${id}-label`}
          value={value}
          onChange={onChange} >
          {userOptions}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>

    )
  }
}

const styles = theme => ({
  root: {
    minWidth: 120,
    width: '100%'
  },
  option: {
    width: '100%'
  }
});

SelectUsers.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state, props) => {
  return {
    users: selectUsersByRoles(state, props.roles),
  }
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(SelectUsers)
  ));