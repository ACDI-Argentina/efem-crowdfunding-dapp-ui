import React, { Component } from 'react';
import { registerCurrentUser, selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import { User } from '@acdi/efem-dapp';
import { history } from 'lib/helpers';
import Avatar from '../Avatar/Avatar';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import InputAdornment from '@material-ui/core/InputAdornment'
import Page from './Page'
import Background from 'components/views/Background'
import { InputField } from '@acdi/efem-dapp';
import Paper from '@material-ui/core/Paper';
import PrimaryButtonOutline from 'components/buttons/PrimaryButtonOutline';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { ipfsService, validatorUtils } from 'commons';
/**
 * Formulario de perfil de usuario.
 * 
 */
class UserProfilePage extends Component {

  constructor(props) {
    super(props);

    const { currentUser } = props;

    this.state = {
      name: currentUser.name,
      email: currentUser.email,
      url: currentUser.url,
      avatar: null,
      avatarPreview: null,
      user: new User(currentUser),
      avatarImg: ipfsService.resolveUrl(currentUser.avatarCid),
      registered: false,
      nameHelperText: '',
      nameError: false,
      emailHelperText: '',
      urlHelperText: '',
      formValid: false,
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      isBlocking: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
    this.setFormValid = this.setFormValid.bind(this);

  }

  clearForm() {
    this.setState({
      name: "",
      email: "",
      url: "",
      user: new User(this.props.currentUser)
    })
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

  async componentDidUpdate(prevProps, prevState) {
    const userHasUpdated = prevProps.currentUser !== this.props.currentUser;

    const prevAddress = prevProps.currentUser && prevProps.currentUser.address;
    const nextAddress = this.props.currentUser && this.props.currentUser.address;

    const userHasChanged = prevAddress && nextAddress && (prevAddress !== nextAddress);
    const userHasDisconnected = this.props.currentUser.address === null && prevProps.currentUser.address !== undefined;

    if (userHasDisconnected || userHasChanged) {
      this.clearForm();
    }

    const statusHasChanged = this.props.currentUser.status !== prevProps.currentUser.status;
    if (statusHasChanged) {
      const isRegistering = this.props.currentUser?.status?.name === "Registering";
      this.setState({ isSaving: isRegistering });
    }

    const wasSaving = prevProps.currentUser?.status?.name === "Registering";
    const isRegistered = this.props.currentUser?.status?.name === "Registered";

    if (wasSaving && isRegistered) {
      setTimeout(() => history.push("/"), 1000);
    }

    if (userHasUpdated) {
      console.log(`[User profile] Load current user addrss - ${this.props.currentUser?.address}`);

      const { name, email, url, registered } = this.props.currentUser;


      const state = {};
      if (name) {
        state.name = name;
      }
      if (email) {
        state.email = email;
      }
      if (url) {
        state.url = url;
      }

      if (this.props.currentUser.avatarCid) {
        const avatarCidUrl = ipfsService.resolveUrl(this.props.currentUser.avatarCid);
        state.avatarImg = avatarCidUrl;
      }

      this.setState({ ...state, registered, user: new User(this.props.currentUser) })
    }

  }

  handleChangeName(event) {
    const { t } = this.props;
    let nameError = false;
    let nameHelperText = '';
    const name = event.target.value;
    if (name === undefined || name === '') {
      nameHelperText = t('errorRequired');
      nameError = true;
    }
    this.setState({
      name: name,
      nameHelperText: nameHelperText,
      nameError: nameError
    }, () => {
      this.setFormValid();
    });
  }

  handleChangeEmail(event) {
    const { t } = this.props;
    let emailError = false;
    let emailHelperText = '';
    const email = event.target.value;
    if (email === undefined || email === '') {
      emailHelperText = t('errorRequired');
      emailError = true;
    } else if (!validatorUtils.isValidEmail(email)) {
      emailHelperText = t('errorInvalidEmail');
      emailError = true;
    }
    this.setState({
      email: email,
      emailHelperText: emailHelperText,
      emailError: emailError
    }, () => {
      this.setFormValid();
    });
  }

  handleChangeUrl(event) {
    const { t } = this.props;
    let urlError = false;
    let urlHelperText = '';
    const url = event.target.value;
    if (url === undefined || url === '') {
      urlHelperText = t('errorRequired');
      urlError = true;
    } else if (!validatorUtils.isValidUrl(url)) {
      urlHelperText = t('errorInvalidUrl');
      urlError = true;
    }
    this.setState({
      url: url,
      urlHelperText: urlHelperText,
      urlError: urlError
    }, () => {
      this.setFormValid();
    });
  }

  handleChangeAvatar(avatar) {
    this.setState({
      avatar: avatar
    }, () => {
      this.setFormValid();
    });
  }

  setFormValid() {
    const { name, email, url } = this.state;
    let formValid = true;
    if (name === undefined || name === '') {
      formValid = false;
    }
    if (email === undefined || email === '') {
      formValid = false;
    } else if (!validatorUtils.isValidEmail(email)) {
      formValid = false;
    }
    if (url === undefined || url === '') {
      formValid = false;
    } else if (!validatorUtils.isValidUrl(url)) {
      formValid = false;
    }
    this.setState({
      formValid: formValid
    });
  }

  async handleSubmit(event) {

    event.preventDefault();

    const { currentUser } = this.props;
    let user = this.state.user;

    user.address = currentUser.address;

    user.name = this.state.name;
    user.email = this.state.email;
    user.url = this.state.url;
    user.avatar = this.state.avatarPreview;

    this.setState({ isSaving: true, user: user }, () => {
      console.log(`[UserProfilePage] handleSubmit`, user)
      this.props.registerCurrentUser(this.state.user);
      //history.push(`/`);
    });

  }

  cancel() {
    history.push(`/`);
  }

  render() {
    const {
      nameHelperText,
      nameError,
      emailHelperText,
      emailError,
      urlHelperText,
      urlError,
      formValid,
      avatarImg,
      isSaving
    } = this.state;
    const { currentUser, classes, t, ...rest } = this.props;

    return (
      <Page>
        <Background>
          <Paper>
            <Grid container spacing={1} style={{ padding: "2em" }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5">
                  {t('userProfileTitle')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <form onSubmit={this.handleSubmit}
                  noValidate
                  autoComplete="off" >

                  <Grid container spacing={1} style={{ margin: "0px" }}>

                    <Grid item xs={12} md={5}>
                      <Avatar
                        imageSrc={avatarImg}
                        onCropped={(cropped) => {
                          this.setState({ avatarPreview: cropped })
                          this.setFormValid();
                        }}
                        labels={{
                          choose: t('userAvatarChoose')
                        }}
                      />
                    </Grid>

                    <Grid container spacing={1} xs={12} md={7}>
                      <Grid item xs={12}>
                        <InputField
                          id="addressTextField"
                          value={this.state.user.address}
                          label={t('userAddress')}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccountBalanceWalletIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputField
                          id="nameTextField"
                          value={this.state.name}
                          onChange={this.handleChangeName}
                          label={t('userName')}
                          helperText={nameHelperText}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={nameError}
                          required
                          inputProps={{ maxLength: 42 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputField id="emailTextField"
                          value={this.state.email}
                          onChange={this.handleChangeEmail}
                          label={t('userEmail')}
                          helperText={emailHelperText}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={emailError}
                          required
                          inputProps={{ maxLength: 42 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputField id="urlTextField"
                          value={this.state.url}
                          onChange={this.handleChangeUrl}
                          label={t('userUrl')}
                          helperText={urlHelperText}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={urlError}
                          required
                          inputProps={{ maxLength: 42 }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container
                      xs={12}
                      justifyContent="flex-end"
                      spacing={2}>

                      <Grid item>
                        <PrimaryButtonOutline
                          onClick={this.cancel}>
                          {t("cancel")}
                        </PrimaryButtonOutline>
                      </Grid>
                      <Grid item>
                        <PrimaryButton
                          type="submit"
                          disabled={!formValid || isSaving}
                          isWorking={isSaving}>
                          {t("save")}
                        </PrimaryButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Paper>
        </Background>
      </Page >
    );
  }
}

UserProfilePage.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { registerCurrentUser }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(UserProfilePage)))
);