import React, { Component } from 'react'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice'
import { saveUser } from '../../redux/reducers/usersSlice'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { Web3AppContext } from 'lib/blockchain/Web3App'
import { withTranslation } from 'react-i18next'
import Avatar from '../Avatar/Avatar'
import { selectUserByAddress } from 'redux/reducers/usersSlice'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import { selectRoles } from 'redux/reducers/rolesSlice'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import InputAdornment from '@material-ui/core/InputAdornment'
import {
  InputField,
  User,
  RoleChip,
  history
} from '@acdi/efem-dapp'
import Page from './Page'
import Background from 'components/views/Background'
import Paper from '@material-ui/core/Paper';
import SecondaryButton from 'components/buttons/SecondaryButton';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { validatorUtils } from 'commons';
import { ipfsService } from 'commons'
import PrimaryButtonOutline from 'components/buttons/PrimaryButtonOutline'

/**
 * Edición de usuario.
 * 
 */
class UserPage extends Component {

  constructor(props) {
    super(props);

    const { user, roles } = props;

    const rolesSelected = [];
    roles.forEach(r1 => {
      if (user.roles.some(r2 => r1.value === r2.value)) {
        rolesSelected.push(r1);
      }
    });

    this.state = {
      name: user.name,
      email: user.email,
      url: user.url,
      avatar: null,
      avatarPreview: null,
      user: new User(user),
      avatarImg: ipfsService.resolveUrl(user.avatarCid),
      rolesSelected: rolesSelected,
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
    this.handleChangeRoles = this.handleChangeRoles.bind(this);
    this.setFormValid = this.setFormValid.bind(this);
  }

  clearForm() {
    this.setState({
      name: "",
      email: "",
      url: "",
      user: new User(this.props.user)
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

  handleChangeRoles(event) {
    this.setState({
      rolesSelected: event.target.value
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

  getStyles(role, rolesSelected, theme) {
    let isSelected = false;
    for (let i = 0; i < rolesSelected.length; i++) {
      if (rolesSelected[i].value === role.value) {
        isSelected = true;
        break;
      }
    }
    return {
      fontWeight: isSelected
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  async handleSubmit(event) {

    event.preventDefault();

    let user = this.state.user;
    user.name = this.state.name;
    user.email = this.state.email;
    user.url = this.state.url;
    user.avatar = this.state.avatarPreview;
    user.roles = this.state.rolesSelected;

    this.setState(
      {
        isSaving: true,
        user: user
      },
      () => {
        this.props.saveUser(user);
        history.push(`/users`);
      });
  }

  cancel() {
    history.push(`/users`);
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
      isSaving,
      rolesSelected
    } = this.state;
    const { currentUser, roles, classes, t, theme, ...rest } = this.props;

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250
        },
      },
    };

    return (
      <Page>
        <Background>
          <Paper>
            <Grid container spacing={1} style={{ padding: "2em" }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5">
                  {t('userEditTitle')}
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

                      <Grid item xs={12}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id="rolesLabel">
                            {t('userRoles')}
                          </InputLabel>
                          <Select
                            id="roles"
                            labelId="rolesLabel"
                            multiple
                            value={rolesSelected}
                            onChange={this.handleChangeRoles}
                            input={<Input id="rolesInput" />}
                            renderValue={(rolesSelected) => (
                              <div className={classes.chips}>
                                {rolesSelected.map((roleSelected) => (
                                  <RoleChip key={roleSelected.value} role={roleSelected} />
                                ))}
                              </div>
                            )}
                            MenuProps={MenuProps}
                          >
                            {roles.map((role) => (
                              <MenuItem key={role.value}
                                value={role}
                                style={this.getStyles(role, rolesSelected, theme)}>
                                {role.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container
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
      </Page>
    );
  }
}

UserPage.contextType = Web3AppContext;

const styles = theme => ({
  formControl: {
    minWidth: 120
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  }
});

const mapStateToProps = (state, ownProps) => {
  const userAddress = ownProps.match.params.userAddress;
  return {
    currentUser: selectCurrentUser(state),
    user: selectUserByAddress(state, userAddress),
    roles: selectRoles(state)
  };
}
const mapDispatchToProps = {
  saveUser
}

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles, { withTheme: true })(
  withTranslation()(UserPage)))
);