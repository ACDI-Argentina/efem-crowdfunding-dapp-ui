import React, { Component } from 'react';
import { registerCurrentUser, selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import { history } from 'lib/helpers';
import Avatar from '../Avatar/Avatar';
import Page from './Page'
import Background from 'components/views/Background'
import { InputField } from '@acdi/efem-dapp';
import Paper from '@material-ui/core/Paper';
import PrimaryButtonOutline from 'components/buttons/PrimaryButtonOutline';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { ipfsService, validatorUtils } from 'commons';
import { DAC } from 'models';
import { saveDac, selectDac } from '../../redux/reducers/dacsSlice';
import RichTextEditor from '../RichTextEditor';

/**
 * Formulario de creación de DAC.
 * 
 */
class DacPage extends Component {

  constructor(props) {
    super(props);

    const { currentUser, dac } = this.props;
    let dacInit = dac;
    if (!dac) {
      // Nueva DAC
      dacInit = new DAC({
        delegateAddress: currentUser.address,
        status: DAC.PENDING
      });
    }

    this.state = {
      title: dacInit.title,
      titleHelperText: '',
      titleError: false,

      abstract: dacInit.abstract,
      abstractHelperText: '',
      abstractError: false,

      description: dacInit.description,
      descriptionHelperText: '',
      descriptionError: false,

      url: dacInit.url,
      urlHelperText: '',
      urlError: false,

      avatar: dacInit.avatar,
      avatarPreview: null,
      avatarImg: ipfsService.resolveUrl(dacInit.imageCid),

      dac: dacInit,

      formValid: false,
      isSaving: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeAbstract = this.handleChangeAbstract.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
    this.setFormValid = this.setFormValid.bind(this);
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

  handleChangeAbstract(event) {
    const { t } = this.props;
    let abstractError = false;
    let abstractHelperText = '';
    const abstract = event.target.value;
    if (abstract === undefined || abstract === '') {
      abstractHelperText = t('errorRequired');
      abstractError = true;
    }
    this.setState({
      abstract: abstract,
      abstractHelperText: abstractHelperText,
      abstractError: abstractError
    }, () => {
      this.setFormValid();
    });
  }

  /**
   * TODO Validar que la descripción de entidades tenga contendido ya que ahora falla porque interpreta que "<p></p>" tiene contenido.
   * 
   */
  handleChangeDescription(value) {
    const { t } = this.props;
    let descriptionError = false;
    let descriptionHelperText = '';
    //const description = event.target.value;
    const description = value;
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
    const { title, abstract, description, url } = this.state;
    let formValid = true;
    if (title === undefined || title === '') {
      formValid = false;
    }
    if (abstract === undefined || abstract === '') {
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
    dac.abstract = this.state.abstract;
    dac.description = this.state.description;
    dac.url = this.state.url;
    dac.image = this.state.avatarPreview;

    console.log('Guardado de DAC', dac);

    this.setState(
      {
        dac: dac,
        isSaving: true
      },
      () => {
        this.props.saveDac(this.state.dac);
        this.setState(
          {
            isSaving: false
          });
        history.push(`/`);
      });
  }

  cancel() {
    history.push(`/`);
  }

  render() {
    const {
      dac,
      titleHelperText,
      titleError,
      abstractHelperText,
      abstractError,
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
                  {dac.id ? t('dacEditTitle') : t('dacNewTitle')}
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
                          choose: t('dacAvatarChoose')
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={7}>

                      <Grid container spacing={1}>
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
                          <InputField
                            id="abstractTextField"
                            value={this.state.abstract}
                            onChange={this.handleChangeAbstract}
                            label={t('dacAbstract')}
                            helperText={abstractHelperText}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={abstractError}
                            required
                            inputProps={{ maxLength: 200 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <RichTextEditor
                            value={this.state.description}
                            placeholder={t('dacDescriptionHelp')}
                            onChange={this.handleChangeDescription}>
                          </RichTextEditor>
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
                    </Grid>

                    <Grid item xs={12}>

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
  const props = {
    currentUser: selectCurrentUser(state),
  };
  if (ownProps.match.params.dacId) {
    const dacId = parseInt(ownProps.match.params.dacId);
    props.dac = selectDac(state, dacId);
  }
  return props;
}
const mapDispatchToProps = { registerCurrentUser, saveDac }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(DacPage)))
);