import React, { Component } from 'react'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import UserTable from '../views/UserTable'
import Page from './Page'
import { Typography } from '@material-ui/core'
import Background from 'components/views/Background'
import Paper from '@material-ui/core/Paper'

/**
 * Pantalla de Usuarios.
 * 
 */
class UsersPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      isBlocking: false
    };
  }

  async requestConnection(translate) {

    const labels = {
      title: translate("requestConnectionTitle"),
      text: translate("requestConnectionText"),
      cancel: translate("requestConnectionCancel"),
      ok: translate("requestConnectionOk"),
    }

    const confirm = await React.swal({
      icon: 'info',
      title: labels.title,
      text: labels.text,

      buttons: [labels.cancel, labels.ok],
      closeOnClickOutside: false,
    });

    return confirm;
  }

  render() {

    const { classes, t, ...rest } = this.props;

    return (
      <Page>
        <Background>
          <Paper>
            <Grid container spacing={3} style={{ padding: "2em" }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5">
                  {t('usersTitle')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <UserTable />
              </Grid>
            </Grid>
          </Paper>
        </Background>
      </Page>
    );
  }
}

UsersPage.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(UsersPage)))
);