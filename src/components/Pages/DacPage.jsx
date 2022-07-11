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
import { DAC } from 'models';
import { saveDac, selectDac } from '../../redux/reducers/dacsSlice';

/**
 * Formulario de creación de DAC.
 * 
 */
class DacPage extends Component {

  constructor(props) {
    super(props);

    const { currentUser } = props;

    // DAC model
    const dac = new DAC({ 
      delegateAddress: this.props.currentUser.address,
      status: DAC.PENDING
    });

    this.state = {
      title: '',
      titleHelperText: '',
      titleError: false,

      description: '',
      descriptionHelperText: '',
      descriptionError: false,

      title: '',
      titleHelperText: '',
      titleError: false,

      avatar: null,
      avatarPreview: null,

      dac: dac,
      avatarImg: ipfsService.resolveUrl(currentUser.avatarCid),
      registered: false,
      
      formValid: false,
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      isBlocking: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
    this.setFormValid = this.setFormValid.bind(this);

  }

  clearForm() {
    // DAC model
    const dac = new DAC({ 
      delegateAddress: this.props.currentUser.address,
      status: DAC.PENDING
    });
    this.setState({
      title: "",
      description: "",
      url: "",
      dac: dac
    })
  }

  handleChangeTitle(event) {
    const { t } = this.props;
    let titleError = false;
    let titleHelperText = '';
    const title = event.target.value;
    if (title === undefined || title === '') {
      titleHelperText = t('errorRequired');
      titleError = true;
    }
    this.setState({
      title: title,
      titleHelperText: titleHelperText,
      titleError: titleError
    }, () => {
      this.setFormValid();
    });
  }

  handleChangeDescription(event) {
    const { t } = this.props;
    let descriptionError = false;
    let descriptionHelperText = '';
    const description = event.target.value;
    if (description === undefined || description === '') {
      descriptionHelperText = t('errorRequired');
      descriptionError = true;
    }
    this.setState({
      description: description,
      descriptionHelperText: descriptionHelperText,
      descriptionError: descriptionError
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
    const { title, description, url } = this.state;
    let formValid = true;
    if (title === undefined || title === '') {
      formValid = false;
    }
    if (description === undefined || description === '') {
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

    let dac = this.state.dac;

    dac.title = this.state.title;
    dac.description = this.state.description;
    dac.url = this.state.url;
    dac.avatar = this.state.avatarPreview;

    this.setState({ isSaving: true, dac: dac }, () => {
      this.props.saveDac(this.state.dac);
      history.push(`/`);
    });
  }

  cancel() {
    history.push(`/`);
  }

  render() {
    const {
      titleHelperText,
      titleError,
      descriptionHelperText,
      descriptionError,
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
                  {t('createDacTitle')}
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
                          id="titleTextField"
                          value={this.state.title}
                          onChange={this.handleChangeTitle}
                          label={t('dacTitle')}
                          helperText={titleHelperText}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={titleError}
                          required
                          inputProps={{ maxLength: 42 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputField id="descriptionTextField"
                          value={this.state.description}
                          onChange={this.handleChangeDescription}
                          label={t('dacDescription')}
                          helperText={descriptionHelperText}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={descriptionError}
                          required
                          inputProps={{ maxLength: 42 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InputField id="urlTextField"
                          value={this.state.url}
                          onChange={this.handleChangeUrl}
                          label={t('dacUrl')}
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

DacPage.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { registerCurrentUser, saveDac }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(DacPage)))
);