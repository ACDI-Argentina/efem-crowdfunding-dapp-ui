import React, { Component } from 'react';
import { registerCurrentUser, selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import { history } from '@acdi/efem-dapp';
import Avatar from '../Avatar/Avatar';
import Page from './Page'
import Background from 'components/views/Background'
import { InputField } from '@acdi/efem-dapp';
import Paper from '@material-ui/core/Paper';
import PrimaryButtonOutline from 'components/buttons/PrimaryButtonOutline';
import PrimaryButton from 'components/buttons/PrimaryButton';
import { ipfsService, validatorUtils } from 'commons';
import { Milestone } from 'models';
import { saveMilestone, selectMilestone } from '../../redux/reducers/milestonesSlice';
import RichTextEditor from '../RichTextEditor';
import SelectUsers from 'components/SelectUsers';
import { selectCampaign } from '../../redux/reducers/campaignsSlice'
import FiatUtils from 'utils/FiatUtils';
import BigNumber from 'bignumber.js';
import config from 'configuration';
BigNumber.config({ DECIMAL_PLACES: 18 });

/**
 * Formulario de creación de Milestone.
 * 
 */
class MilestonePage extends Component {

  constructor(props) {
    super(props);

    const { currentUser, milestone } = this.props;

    let milestoneInit = milestone;
    if (!milestone) {
      // Nuevo milestone
      milestoneInit = new Milestone({
        //campaignReviewerAddress: campaign.reviewerAddress,
        //campaignId: campaign.id,
        managerAddress: currentUser.address,
        status: Milestone.PENDING
      });
    }

    this.state = {
      title: milestoneInit.title,
      titleHelperText: '',
      titleError: false,

      abstract: milestoneInit.abstract,
      abstractHelperText: '',
      abstractError: false,

      description: milestoneInit.description,
      descriptionHelperText: '',
      descriptionError: false,

      url: milestoneInit.url,
      urlHelperText: '',
      urlError: false,

      fiatAmountTarget: FiatUtils.centToDollar(milestoneInit.fiatAmountTarget).toFixed(),
      fiatAmountTargetHelperText: '',
      fiatAmountTargetError: false,

      reviewerAddress: milestoneInit.reviewerAddress,
      reviewerAddressHelperText: '',
      reviewerAddressError: false,

      recipientAddress: milestoneInit.recipientAddress,
      recipientAddressHelperText: '',
      recipientAddressError: false,

      avatar: milestoneInit.avatar,
      avatarPreview: null,
      avatarImg: ipfsService.resolveUrl(milestoneInit.imageCid),

      milestone: milestoneInit,

      formValid: false,
      isSaving: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeAbstract = this.handleChangeAbstract.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.handleChangeFiatAmountTarget = this.handleChangeFiatAmountTarget.bind(this);
    this.handleChangeAvatar = this.handleChangeAvatar.bind(this);
    this.handleChangeReviewer = this.handleChangeReviewer.bind(this);
    this.handleChangeRecipient = this.handleChangeRecipient.bind(this);
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
    if (!validatorUtils.htmlHasText(description)) {
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

  handleChangeFiatAmountTarget(event) {
    const { t } = this.props;
    let fiatAmountTargetError = false;
    let fiatAmountTargetHelperText = '';
    const fiatAmountTarget = event.target.value;
    if (fiatAmountTarget === undefined || fiatAmountTarget === '' || fiatAmountTarget === 0) {
      fiatAmountTargetHelperText = t('errorRequired');
      fiatAmountTargetError = true;
    } else if (fiatAmountTarget <= 0) {
      fiatAmountTargetHelperText = t('errorGreaterThanZero');
      fiatAmountTargetError = true;
    }
    this.setState({
      fiatAmountTarget: fiatAmountTarget,
      fiatAmountTargetHelperText: fiatAmountTargetHelperText,
      fiatAmountTargetError: fiatAmountTargetError
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

  handleChangeRecipient(event) {
    const { t } = this.props;
    let recipientAddressError = false;
    let recipientAddressHelperText = '';
    const recipientAddress = event.target.value;
    if (recipientAddress === undefined || recipientAddress === '') {
      recipientAddressHelperText = t('errorRequired');
      recipientAddressError = true;
    }
    this.setState({
      recipientAddress: recipientAddress,
      recipientAddressHelperText: recipientAddressHelperText,
      recipientAddressError: recipientAddressError
    }, () => {
      this.setFormValid();
    });
  }

  setFormValid() {
    const { title,
      abstract,
      description,
      url,
      fiatAmountTarget,
      reviewerAddress,
      recipientAddress } = this.state;
    let formValid = true;
    if (title === undefined || title === '') {
      formValid = false;
    }
    if (abstract === undefined || abstract === '') {
      formValid = false;
    }
    if (!validatorUtils.htmlHasText(description)) {
      formValid = false;
    }
    if (url === undefined || url === '') {
      formValid = false;
    } else if (!validatorUtils.isValidUrl(url)) {
      formValid = false;
    }
    if (fiatAmountTarget === undefined || fiatAmountTarget === '') {
      formValid = false;
    } else if (fiatAmountTarget <= 0) {
      formValid = false;
    }
    if (reviewerAddress === undefined || reviewerAddress === '') {
      formValid = false;
    }
    if (recipientAddress === undefined || recipientAddress === '') {
      formValid = false;
    }
    this.setState({
      formValid: formValid
    });
  }

  async handleSubmit(event) {

    event.preventDefault();

    const { campaign } = this.props;
    const { milestone } = this.state;

    if (campaign && !milestone.campaignId) {
      // Es un nuevo Milestone.
      milestone.campaignId = campaign.id;
      milestone.campaignReviewerAddress = campaign.reviewerAddress;
    }

    milestone.title = this.state.title;
    milestone.abstract = this.state.abstract;
    milestone.description = this.state.description;
    milestone.url = this.state.url;
    milestone.image = this.state.avatarPreview;
    milestone.fiatAmountTarget = FiatUtils.dollarToCent(new BigNumber(this.state.fiatAmountTarget));
    milestone.reviewerAddress = this.state.reviewerAddress;
    milestone.recipientAddress = this.state.recipientAddress;

    console.log('Guardado de Milestone', milestone);

    this.setState(
      {
        milestone: milestone,
        isSaving: true
      },
      () => {
        this.props.saveMilestone(this.state.milestone);
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
      milestone,
      titleHelperText,
      titleError,
      abstractHelperText,
      abstractError,
      urlHelperText,
      urlError,
      fiatAmountTargetHelperText,
      fiatAmountTargetError,
      formValid,
      avatarImg,
      isSaving
    } = this.state;
    const { currentUser, classes, t } = this.props;

    if (!milestone) {
      return null;
    }

    if (!currentUser || !currentUser.authenticated) {
      history.push(`/`);
    }

    return (
      <Page>
        <Background>
          <Paper>
            <Grid container spacing={1} style={{ padding: "2em" }}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h5">
                  {milestone.id ? t('milestoneEditTitle') : t('milestoneNewTitle')}
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
                          choose: t('milestoneAvatarChoose')
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
                            label={t('milestoneTitle')}
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
                            label={t('milestoneAbstract')}
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
                            placeholder={t('milestoneDescriptionHelp')}
                            onChange={this.handleChangeDescription}>
                          </RichTextEditor>
                        </Grid>

                        <Grid item xs={12}>
                          <InputField id="urlTextField"
                            value={this.state.url}
                            onChange={this.handleChangeUrl}
                            label={t('milestoneUrl')}
                            helperText={urlHelperText}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={urlError}
                            required
                            inputProps={{ maxLength: 256 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <InputField id="fiatAmountTargetTextField"
                            value={this.state.fiatAmountTarget}
                            onChange={this.handleChangeFiatAmountTarget}
                            label={t('milestoneFiatAmountTarget')}
                            helperText={fiatAmountTargetHelperText}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={fiatAmountTargetError}
                            required
                            inputProps={{ maxLength: 5 }}
                            type="number"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <SelectUsers
                            id="reviewerAddress"
                            label={t('milestoneReviewer')}
                            value={this.state.reviewerAddress}
                            roles={[config.MILESTONE_REVIEWER_ROLE]}
                            onChange={this.handleChangeReviewer}
                            helperText={this.state.reviewerAddressHelperText}>
                          </SelectUsers>
                        </Grid>

                        <Grid item xs={12}>
                          <SelectUsers
                            id="recipientAddress"
                            label={t('milestoneRecipient')}
                            value={this.state.recipientAddress}
                            roles={[config.RECIPIENT_ROLE]}
                            onChange={this.handleChangeRecipient}
                            helperText={this.state.recipientAddressHelperText}>
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

MilestonePage.contextType = Web3AppContext;

const styles = theme => ({

});

const mapStateToProps = (state, ownProps) => {
  const props = {
    currentUser: selectCurrentUser(state),
  };
  if (ownProps.match.params.campaignId) {
    const campaignId = parseInt(ownProps.match.params.campaignId);
    props.campaign = selectCampaign(state, campaignId);
  }
  if (ownProps.match.params.milestoneId) {
    const milestoneId = parseInt(ownProps.match.params.milestoneId);
    props.milestone = selectMilestone(state, milestoneId);
  }
  return props;
}
const mapDispatchToProps = { registerCurrentUser, saveMilestone }

export default connect(mapStateToProps, mapDispatchToProps)((withStyles(styles)(
  withTranslation()(MilestonePage)))
);