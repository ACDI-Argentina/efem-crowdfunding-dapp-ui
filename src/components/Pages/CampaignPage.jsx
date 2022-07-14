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
import { Campaign } from 'models';
import { saveCampaign } from '../../redux/reducers/campaignsSlice';
import RichTextEditor from '../RichTextEditor';
import SelectUsers from 'components/SelectUsers';
import { CAMPAIGN_REVIEWER_ROLE } from '../../constants/Role';

/**
 * Formulario de creación de Campaign.
 * 
 */
class CampaignPage extends Component {

  constructor(props) {
    super(props);
    const campaign = new Campaign({
      managerAddress: props.currentUser.address,
      status: Campaign.PENDING
    });

    this.state = {
      title: '',
      titleHelperText: '',
      titleError: false,

      abstract: '',
      abstractHelperText: '',
      abstractError: false,

      description: '',
      descriptionHelperText: '',
      descriptionError: false,

      url: '',
      urlHelperText: '',
      urlError: false,

      reviewerAddress: '',
      reviewerAddressHelperText: '',
      reviewerAddressError: false,

      avatar: null,
      avatarPreview: null,
      avatarImg: ipfsService.resolveUrl(campaign.imageCid),

      campaign: campaign,

      formValid: false,
      isSaving: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeAbstract = this.handleChangeAbstract.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
    this.handleChangeReviewer = this.handleChangeReviewer.bind(this);
    this.setFormValid = this.setFormValid.bind(this);
  }

  clearForm() {
    const campaign = new Campaign({
      managerAddress: this.props.currentUser.address,
      status: Campaign.PENDING
    });
    this.setState({
      title: "",
      abstract: "",
      description: "",
      url: "",
      avatarImg: ipfsService.resolveUrl(campaign.imageCid),
      campaign: campaign
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


  handleChangeReviewer(event) {
    const { t } = this.props;
    let reviewerAddressError = false;
    let reviewerAddressHelperText = '';
    //const description = event.target.value;
    const reviewerAddress = event.target.value;
    if (reviewerAddress === undefined || reviewerAddress === '') {
      reviewerAddressHelperText = t('errorRequired');
      reviewerAddressError = true;
    }
    this.setState({
      reviewerAddress: reviewerAddress,
      reviewerAddressHelperText: reviewerAddressHelperText,
      reviewerAddressError: reviewerAddressError
    }, () => {
      this.setFormValid();
    });
  }

  setFormValid() {
    const { title, abstract, description, url, reviewerAddress } = this.state;
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
    if (reviewerAddress === undefined || reviewerAddress === '') {
      formValid = false;
    }
    this.setState({
      formValid: formValid
    });
  }

  async handleSubmit(event) {

    event.preventDefault();

    let campaign = this.state.campaign;

    campaign.title = this.state.title;
    campaign.abstract = this.state.abstract;
    campaign.description = this.state.description;
    campaign.url = this.state.url;
    campaign.image = this.state.avatarPreview;
    campaign.reviewerAddress = this.state.reviewerAddress;

    console.log('Guardado de Campaign', campaign);

    this.setState(
      {
        campaign: campaign,
        isSaving: true
      },
      () => {
        this.props.saveCampaign(this.state.campaign);
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
    const { currentUser, classes, t } = this.props;

    return (
      <Page>
        <Background>
          <Paper>
            <Grid container spacing={1} style={{ padding: "2em" }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5">
                  {t('createCampaignTitle')}
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
                          choose: t('campaignAvatarChoose')
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
                            label={t('campaignTitle')}
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
                            label={t('campaignAbstract')}
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
                            placeholder={t('campaignDescriptionHelp')}
                            onChange={this.handleChangeDescription}>
                          </RichTextEditor>
                        </Grid>

                        <Grid item xs={12}>
                          <InputField id="urlTextField"
                            value={this.state.url}
                            onChange={this.handleChangeUrl}
                            label={t('campaignUrl')}
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
                          <SelectUsers
                            id="reviewerAddress"
                            label={t('campaignReviewerLabel')}
                            value={this.state.reviewerAddress}
                            roles={[CAMPAIGN_REVIEWER_ROLE]}
                            onChange={this.handleChangeReviewer}
                            helperText={this.state.reviewerAddressHelperText}>
                          </SelectUsers>
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

CampaignPage.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { registerCurrentUser, saveCampaign }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(CampaignPage)))
);