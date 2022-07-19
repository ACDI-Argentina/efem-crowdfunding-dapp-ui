import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import classNames from "classnames";

import PropTypes from 'prop-types';
import 'react-input-token/lib/style.css';
import { Form, Input } from 'formsy-react-components';
import Loader from '../Loader';
import QuillFormsy from '../QuillFormsy';
import SelectUsers from '../SelectUsers';

import FormsyImageUploader from '../FormsyImageUploader';
import GoBackButton from '../GoBackButton';
import { isOwner, history } from '../../lib/helpers';
import LoaderButton from '../LoaderButton';
import { User } from '@acdi/efem-dapp';
import Campaign from '../../models/Campaign';

import { connect } from 'react-redux'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { campaignReviewers } from '../../redux/reducers/usersSlice';
import { saveCampaign, selectCampaign } from '../../redux/reducers/campaignsSlice'
import { CAMPAIGN_REVIEWER_ROLE } from '../../constants/Role';

import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import { withStyles } from '@material-ui/core/styles';
import styles from "assets/jss/material-kit-react/views/campaignPage.js";
import { withTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';
import CategorySelector from 'components/CategorySelector';

import { Web3AppContext } from 'lib/blockchain/Web3App';

/**
 * View to create or edit a Campaign
 *
 * @param isNew    If set, component will load an empty model.
 *                 Otherwise component expects an id param and will load a campaign object
 * @param id       URL parameter which is an id of a campaign object
 */
class EditCampaign extends Component {
  constructor(props) {
    super(props);

    const campaign = new Campaign({
      managerAddress: props.currentUser && props.currentUser.address,
      status: Campaign.PENDING
    });

    this.state = {
      isLoading: false,
      isSaving: false,
      formIsValid: false,
      campaign: campaign,
      isBlocking: false
    };

    this.form = React.createRef();

    this.submit = this.submit.bind(this);
    this.setImage = this.setImage.bind(this);
    this.setCategories = this.setCategories.bind(this);
  }

  componentDidMount() {

    this.mounted = true;

    this.checkUser().then(() => {
      const isEditingCampaign = !this.props.isNew;
      if (isEditingCampaign) {
        const campaign = this.props.campaign;
        this.setState({ campaign, isLoading: false })
      } else {
        this.setState({ isLoading: false });
      }
    }).catch(err => {
      if (err === 'noBalance') {
        // handle no balance error
      }
    });
  }

  componentDidUpdate(prevProps) {
    /*if (prevProps.currentUser !== this.props.currentUser) {
      this.checkUser().then(() => {
        if (!this.props.isNew && !isOwner(this.state.campaign.managerddress, this.props.currentUser))
          history.goBack();
      });
    }*/
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setImage(image) {
    const { campaign } = this.state;
    campaign.image = image;
    this.setState({ campaign });
  }

  setCategories(categories) {
    const { campaign } = this.state;
    campaign.categories = categories;
    this.setState({ campaign });
  }

  checkUser() {

    const { currentUser } = this.props;
    const { authenticateIfPossible, checkProfile } = this.context.modals.methods;

    if (!currentUser) {
      history.push('/');
      return Promise.reject("Not allowed. No user logged in");
    }

    if (!this.props.isCampaignManager) {
      history.push('/');
      return Promise.reject("Not allowed. User is not campaign manager");
    }


    return authenticateIfPossible(currentUser)
      .then(() => checkProfile(currentUser));
  }

  submit() {
    this.setState({ isSaving: true, isBlocking: false }, () => {
      // Save the campaign
      this.props.saveCampaign(this.state.campaign);
      history.push(`/`);
    });
  }

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  triggerRouteBlocking() {
    const form = this.form.current.formsyForm.current;
    // we only block routing if the form state is not submitted
    this.setState({ isBlocking: form && form.state && (!form.state.isSubmitting) });
  }

  render() {
    const { isNew, t } = this.props;
    const { isLoading, isSaving, campaign, formIsValid, isBlocking } = this.state;

    const { ...rest } = this.props;
    const { classes } = this.props;

    return (
      <div id="edit-campaign-view">
        <Header
          color="white"
          brand={<img src={require("assets/img/logos/give4forest.svg")}
          alt={t('give4forest')}
          className={classes.dappLogo}/>}
          rightLinks={<MainMenu />}
          fixed
          changeColorOnScroll={{
            height: 0,
            color: "white"
          }}
          {...rest}
        />
        {isNew && <Parallax small image={require("assets/img/campaign-default-bg.jpg")}/>}
        {!isNew && <Parallax small image={campaign.imageCidUrl}/>}
        
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>

                  {isLoading && <Loader className="fixed" />}

                  {!isLoading && (
                    <div>
                      <GoBackButton history={history} />

                      <div className="form-header">
                        {isNew && <h3>{t('newCampaignTitle')}</h3>}

                        {!isNew && <h3>{t('editCampaignTitle')} {campaign.title}</h3>}
                        <p>
                          <i className="fa fa-question-circle" />{t('campaignDescription')}
                        </p>
                      </div>

                      <Form
                        onSubmit={this.submit}
                        ref={this.form}
                        mapping={inputs => {
                          campaign.title = inputs.title;
                          campaign.description = inputs.description;
                          campaign.url = inputs.url;
                          campaign.reviewerAddress = inputs.reviewerAddress;
                          campaign.beneficiaries = inputs.beneficiaries;
                          //campaign.summary = getTruncatedText(inputs.description, 100);
                        }}
                        onValid={() => this.toggleFormValid(true)}
                        onInvalid={() => this.toggleFormValid(false)}
                        onChange={e => this.triggerRouteBlocking(e)}
                        layout="vertical"
                      >
                        <Prompt when={isBlocking} message={() => t('unsavedChanges')}/>

                        <Input
                          name="title"
                          id="title-input"
                          label={t('campaignTitleLabel')}
                          type="text"
                          value={campaign.title}
                          placeholder={t('campaignTitlePlaceholder')}
                          help={t('campaignTitleHelp')}
                          validations="minLength:3"
                          validationErrors={{
                            minLength: t('campaignTitleValidationMinLength'),
                          }}
                          required
                          autoFocus
                        />

                        <QuillFormsy
                          name="description"
                          label={t('campaignDescriptionLabel')}
                          helpText={t('campaignDescriptionHelp')}
                          value={campaign.description}
                          placeholder={t('campaignDescriptionPlaceholder')}
                          validations="minLength:20"
                          validationErrors={{
                            minLength: t('campaignDescriptionError'),
                          }}
                          required
                        />

                        <div className="form-group">
                          <CategorySelector
                            setCategories={this.setCategories}
                            id="categories"
                            name="categories"
                            label={t('campaignCategoriesLabel')}
                            helpText={t('campaignCategoriesHelp')}
                            value={campaign.categories}
                          />
                        </div>

                        <div className="form-group">
                          <FormsyImageUploader
                            setImage={this.setImage}
                            previewImage={campaign.imageCidUrl}
                            isRequired={isNew}
                          />
                        </div>

                        <Input
                          name="beneficiaries"
                          id="beneficiaries"
                          label={t('campaignBeneficiariesLabel')}
                          type="text"
                          value={campaign.beneficiaries}
                          placeholder={t('campaignBeneficiariesPlaceholder')}
                          help={t('campaignBeneficiariesHelp')}
                          validations="minLength:10"
                          validationErrors={{
                            minLength: t('campaignBeneficiariesValidationMinLength'),
                          }}
                          required
                        />

                        <div className="form-group">
                          <Input
                            name="url"
                            id="url"
                            label={t('campaignUrlLabel')}
                            type="text"
                            value={campaign.url}
                            placeholder="https://slack.give4forests.com"
                            help={t('campaignUrlHelp')}
                            validations="isUrl"
                            validationErrors={{ isUrl: t('campaignUrlError') }}
                            required
                          />
                        </div>

                        <div className="form-group">
                          {
                            <SelectUsers
                              roles={[CAMPAIGN_REVIEWER_ROLE]}
                              id="reviewer-select"
                              name="reviewerAddress"
                              label={t('campaignReviewer')}
                              helpText={t('campaignReviewerHelpText')}
                              value={campaign.reviewerAddress}
                              cta={t('campaignReviewerCta')}
                              validations="isEtherAddress"
                              validationErrors={{
                                isEtherAddress: t('campaignReviewerError')
                              }}
                              required
                            />
                          }
                          </div>

                        <div className="form-group">
                          <Box my={2} display="flex" justifyContent="space-between">
                            <Box>
                              <GoBackButton history={history} />
                            </Box>
                            <Box>
                              <LoaderButton
                                color="primary"
                                className="btn btn-info"
                                formNoValidate
                                type="submit"
                                disabled={isSaving || !formIsValid}
                                isLoading={isSaving}
                                loadingText={t('campaignLoadingText')}
                              >
                                {isNew ? t('createCampaignBtn'): t('updateCampaignBtn')} 
                              </LoaderButton>
                            </Box>
                          </Box>
                        </div>
                      </Form>
                    </div>
                  )}

                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}


EditCampaign.contextType = Web3AppContext;

EditCampaign.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  isNew: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isCampaignManager: PropTypes.bool,
};

EditCampaign.defaultProps = {
  currentUser: undefined,
  isNew: false,
};


const mapStateToProps = (state, props) => {
  const campaignId = parseInt(props.match.params.id);
  return {
    currentUser: selectCurrentUser(state),
    isCampaignManager: selectCurrentUser(state).isCampaignManager(),
    reviewers: campaignReviewers(state),
    campaign: selectCampaign(state, campaignId)
  };
};

const mapDispatchToProps = { saveCampaign }

export default connect(mapStateToProps,mapDispatchToProps)((withStyles(styles)(withTranslation() (EditCampaign))));