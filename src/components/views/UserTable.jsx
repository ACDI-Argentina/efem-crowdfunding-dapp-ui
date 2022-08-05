import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { selectUsers } from '../../redux/reducers/usersSlice'
import UserRow from './UserRow'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

/**
 * Tabla de Usuarios.
 * 
 */
class UserTable extends Component {

  render() {
    const { users, classes, t } = this.props;
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>{t('userName')}</TableCell>
                  <TableCell>{t('userEmail')}</TableCell>
                  <TableCell>{t('userAddress')}</TableCell>
                  <TableCell>{t('userRoles')}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <UserRow key={user.address} user={user}></UserRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  }
}

UserTable.contextType = Web3AppContext;

const styles = theme => ({
  table: {
    minWidth: 650,
    '& .MuiTableCell-root': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    },
  },
  cell: {

  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state),
    users: selectUsers(state)
  };
}
const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(UserTable)))
);