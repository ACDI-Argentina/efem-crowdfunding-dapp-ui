/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import classNames from "classnames";

import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { Form, Input } from 'formsy-react-components';
import GA from 'lib/GoogleAnalytics';
import Milestone from 'models/Milestone';
import Loader from '../Loader';
import QuillFormsy from '../QuillFormsy';
import SelectFormsy from '../SelectFormsy';
import FormsyImageUploader from '../FormsyImageUploader';
import GoBackButton from '../GoBackButton';
import { getTruncatedText } from '../../lib/helpers';
import LoaderButton from '../LoaderButton';
import User from '../../models/User';
import ErrorPopup from '../ErrorPopup';
import { Consumer as WhiteListConsumer } from '../../contextProviders/WhiteListProvider';
import FiatUtils from '../../utils/FiatUtils';
import { connect } from 'react-redux'
import { selectCampaign } from '../../redux/reducers/campaignsSlice'
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { saveMilestone, selectMilestone } from '../../redux/reducers/milestonesSlice';
import { milestoneReviewers, recipients } from '../../redux/reducers/usersSlice';

import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import { withStyles } from '@material-ui/core/styles';
import styles from "assets/jss/material-kit-react/views/milestonePage.js";
import { withTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';
import { AppTransactionContext } from 'lib/blockchain/Web3App';

BigNumber.config({ DECIMAL_PLACES: 18 });

/**
 * Create or edit a Milestone
 *
 *  @props
 *    isNew (bool):
 *      If set, component will load an empty model.
 *      If not set, component expects an id param and will load a milestone object from backend
 *
 *  @params
 *    id (string): an id of a milestone object
 */
class EditMilestone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isSaving: false,
      formIsValid: false,
      milestone: new Milestone(),
      isBlocking: false,
    };

    this.form = React.createRef();

    this.submit = this.submit.bind(this);
    this.setImage = this.setImage.bind(this);
    this.changeSelectedFiat = this.changeSelectedFiat.bind(this);
    this.onItemsChanged = this.onItemsChanged.bind(this);
  }

  componentDidMount() {
    console.log("[Edit milestone] component did mount!")
    this.checkUser().then(() => {
        if (!this.props.isNew) {
          console.log("editing milestone!")
          try {
            const campaign = this.props.campaign;
            const milestone = this.props.milestone;

            if(!milestone.canUserEdit(this.props.currentUser)){
              this.props.history.goBack();
            }
            
            this.setState({ isLoading: false, milestone, campaign });
          } catch (err) {
            ErrorPopup(
              'Sadly we were unable to load the requested milestone details. Please try again.',
              err,
            );
          }
        } else {
          try {
            const milestone = new Milestone();

            this.setState({
              isLoading: false,             
              milestone,
              campaign: this.props.campaign
            });
          } catch (e) {
            ErrorPopup(
              'Sadly we were unable to load the campaign in which this milestone was created. Please try again.',
              e,
            );
          }
        }
      })
      .catch(err => {
        // TODO: This is not super user friendly, fix it
        if (err === 'noBalance') this.props.history.goBack();
        else {
          ErrorPopup('Something went wrong. Please try again.', err);
        }
      });
  }

  onAddItem(item) {
    this.addItem(item);
    this.setState({ addMilestoneItemModalVisible: false });
  }

  onItemsChanged(items) {
    const { milestone } = this.state;
    milestone.items = items;
    this.setState({ milestone });
  }

  setImage(image) {
    const { milestone } = this.state;
    milestone.image = image;
    this.setState({ milestone });
  }

  changeSelectedFiat(fiatType) {
    const { milestone } = this.state;
    milestone.fiatType = fiatType;
    this.setState({ milestone });
  }

  toggleFormValid(formState) {
    if (this.state.milestone.itemizeState) {
      this.setState(prevState => ({
        formIsValid: formState && prevState.milestone.items.length > 0,
      }));
    } else {
      this.setState({ formIsValid: formState });
    }
  }

  checkUser() {

    const { currentUser } = this.props;
    const { authenticateIfPossible, checkProfile } = this.context.modals.methods;

    if (!currentUser) {
      this.props.history.push('/');
      return Promise.reject("Not allowed. No user logged in");
    }

    if(!this.props.isCampaignManager){
      this.props.history.push('/');
      return Promise.reject("Not allowed. User is not able to create milestones");
    }

    return authenticateIfPossible(currentUser)
      .then(() => {
        if (
          this.props.isNew &&
          !this.props.isProposed &&
          !this.props.isCampaignManager
        ) {
          throw new Error('not whitelisted');
        }
      })
      .then(() => checkProfile(currentUser));
  }

  toggleItemize() {
    const { milestone } = this.state;
    milestone.itemizeState = !milestone.itemizeState;
    this.setState({ milestone });
  }

  toggleAddMilestoneItemModal() {
    this.setState(prevState => ({
      addMilestoneItemModalVisible: !prevState.addMilestoneItemModalVisible,
    }));
  }

  submit() {
    const { milestone } = this.state;

    milestone.managerAddress = this.state.campaign.managerAddress;
    milestone.campaignReviewerAddress = this.state.campaign.reviewerAddress;
    milestone.campaignId = this.state.campaign.id;
    /*milestone.status =
      this.props.isProposed || milestone.status === Milestone.REJECTED
        ? Milestone.PROPOSED
        : milestone.status; // make sure not to change status!*/
    milestone.status = Milestone.PENDING;

    this.setState({isSaving: true,isBlocking: false,},() => {

        // Save the milestone
        this.props.saveMilestone(milestone);
        GA.trackEvent({
          category: 'Milestone',
          action: 'updated',
          label: this.state.id,
        });
        this.setState({
          isSaving: false,
          isBlocking: false,
        });
        this.props.history.goBack();
      },
    );
  }

  mapInputs(inputs) {
    const { milestone } = this.state;
    milestone.title = inputs.title;
    milestone.description = inputs.description;
    milestone.reviewerAddress = inputs.reviewerAddress;
    milestone.recipientAddress = inputs.recipientAddress;
    milestone.fiatAmountTarget = FiatUtils.dollarToCent(new BigNumber(inputs.fiatAmountTarget));
    // if(!milestone.itemizeState) milestone.maxAmount = inputs.maxAmount;
    this.setState({ milestone });
  }

  removeItem(index) {
    const { milestone } = this.state;
    delete milestone.items[index];
    milestone.items = milestone.items.filter(() => true);
    this.setState({ milestone });
  }

  btnText() {
    if (this.props.isNew) {
      return this.props.isProposed ? 'Propose Milestone' : 'Create Milestone';
    }
    return 'Update Milestone';
  }

  addItem(item) {
    const { milestone } = this.state;
    milestone.items = milestone.items.concat(item);
    this.setState({ milestone });
  }

  triggerRouteBlocking() {
    const form = this.form.current.formsyForm.current;
    // we only block routing if the form state is not submitted
    this.setState({ isBlocking: form && (!form.state.formSubmitted || form.state.isSubmitting) });
  }

  render() {

    const { isNew, isProposed, history, fiatTypes, reviewers, recipients, t } = this.props;
    const { isLoading, isSaving, formIsValid, campaign, isBlocking, milestone } = this.state;
    const { classes } = this.props;
    const { ...rest } = this.props;
    const fiatAmountTarget = FiatUtils.centToDollar(milestone.fiatAmountTarget).toFixed();

    return (
      <div id="edit-milestone-view">
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

        {isNew && <Parallax small image={require("assets/img/milestone-default-bg.jpg")}/>}
        {!isNew && <Parallax small image={milestone.imageCidUrl}/>}

        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>

                  {isLoading && <Loader className="fixed" />}

                  {!isLoading && (
                    <div>
                      <GoBackButton history={history} title={`Campaign: ${campaign.title}`} />

                      <div className="form-header">
                        {isNew && !isProposed && <h3>Add a new milestone</h3>}

                        {!isNew && !isProposed && (
                          <h3>
                            Edit milestone
                            {milestone.title}
                          </h3>
                        )}

                        {isNew && isProposed && <h3>Propose a Milestone</h3>}

                        <h6>
                          Campaign: <strong>{getTruncatedText(campaign.title, 100)}</strong>
                        </h6>

                        <p>
                          <i className="fa fa-question-circle" />A Milestone is a single accomplishment
                          within a project. In the end, all donations end up in Milestones. Once your
                          Milestone is completed, you can request a payout.
                        </p>

                        {isProposed && (
                          <p>
                            <i className="fa fa-exclamation-triangle" />
                            You are proposing a Milestone to the Campaign Owner. The Campaign Owner can
                            accept or reject your Milestone
                          </p>
                        )}
                      </div>

                      <Form
                        id="edit-milestone-form"
                        onSubmit={this.submit}
                        ref={this.form}
                        mapping={inputs => this.mapInputs(inputs)}
                        onValid={() => this.toggleFormValid(true)}
                        onInvalid={() => this.toggleFormValid(false)}
                        onChange={e => this.triggerRouteBlocking(e)}
                        layout="vertical"
                      >
                        <Prompt
                          when={isBlocking}
                          message={() =>
                            `You have unsaved changes. Are you sure you want to navigate from this page?`
                          }
                        />

                        <Input
                          name="title"
                          label="What are you going to accomplish in this Milestone?"
                          id="title-input"
                          type="text"
                          value={milestone.title}
                          placeholder="E.g. buying goods"
                          help="Describe your Milestone in 1 sentence."
                          validations="minLength:3"
                          validationErrors={{
                            minLength: 'Please provide at least 3 characters.',
                          }}
                          required
                          autoFocus
                        />
                        <div className="form-group">
                          <QuillFormsy
                            name="description"
                            label="Explain how you are going to do this successfully."
                            helpText="Make it as extensive as necessary. Your goal is to build trust, so that people donate Ether to your Campaign. Don't hesitate to add a detailed budget for this Milestone"
                            value={milestone.description}
                            placeholder="Describe how you're going to execute your Milestone successfully..."
                            help="Describe your Milestone."
                            required
                          />
                        </div>

                        <div className="form-group">
                          <FormsyImageUploader
                            setImage={this.setImage}
                            previewImage={milestone.imageCidUrl}
                            required={isNew}
                          />
                        </div>

                        <div className="form-group">
                          <SelectFormsy
                            name="reviewerAddress"
                            id="reviewer-select"
                            label="Select a reviewer"
                            helpText="Each milestone needs a reviewer who verifies that the milestone is
                              completed successfully"
                            value={milestone.reviewerAddress}
                            cta="--- Select a reviewer ---"
                            options={reviewers.map(reviewer => ({ ...reviewer, title: reviewer.name, value: reviewer.address }))}
                            validations="isEtherAddress"
                            validationErrors={{
                              isEtherAddress: 'Please select a reviewer.',
                            }}
                            //required
                            disabled={!isNew && !isProposed}
                          />
                        </div>
                        
                        <div className="form-group">
                          <SelectFormsy
                            name="recipientAddress"
                            id="recipient-select"
                            label="Select a recipient"
                            helpText="Cuenta RSK donde los fondos son depositados una vez aprobado el milestone"
                            value={milestone.recipientAddress}
                            cta="--- Select a recipient ---"
                            options={recipients.map(recipient => ({ ...recipient, title: recipient.name, value: recipient.address }))}
                            validations="isEtherAddress"
                            validationErrors={{
                              isEtherAddress: 'Please select a recipient.',
                            }}
                            //required
                            disabled={!isNew && !isProposed}
                          />
                        </div>

                        <div className="card milestone-items-card">
                          <div className="card-body">
                            <div className="form-group row">
                              <div className="col-6">
                                <Input
                                  name="fiatAmountTarget"
                                  min="0"
                                  id="fiataAmountTarget-input"
                                  value={fiatAmountTarget}
                                  type="number"
                                  step="any"
                                  label={`Target amount in ${milestone.fiatType}`}
                                  placeholder="10"
                                  validations="greaterThan:0"
                                  validationErrors={{
                                    greaterEqualTo: 'Minimum value must be greater than 0',
                                  }}
                                />
                              </div>

                              <div className="col-6">
                                <SelectFormsy
                                  name="fiatType"
                                  label="Currency"
                                  value={milestone.fiatType}
                                  options={fiatTypes}
                                  onChange={this.changeSelectedFiat}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <Box my={2} display="flex" justifyContent="space-between">
                            <Box>
                              <GoBackButton history={history} title={`Campaign: ${campaign.title}`} />
                            </Box>
                            <Box>
                              <LoaderButton
                                color="primary"
                                className="btn btn-info"
                                formNoValidate
                                type="submit"
                                disabled={isSaving || !formIsValid}
                                isLoading={isSaving}
                                loadingText="Saving..."
                              >
                                <span>{this.btnText()}</span>
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

EditMilestone.contextType = AppTransactionContext;

EditMilestone.propTypes = {
  currentUser: PropTypes.instanceOf(User),
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  isProposed: PropTypes.bool,
  isNew: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      milestoneId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  fiatTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  isCampaignManager: PropTypes.bool,
  reviewers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tokenWhitelist: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

EditMilestone.defaultProps = {
  currentUser: undefined,
  isNew: false,
  isProposed: false,
};

const EdtMilestone = props => (
  <WhiteListConsumer>
    {({ state: { tokenWhitelist, fiatWhitelist } }) => (
      <EditMilestone
        {...props}
        tokenWhitelist={tokenWhitelist}
        fiatTypes={fiatWhitelist.map(f => ({ value: f, title: f }))}
        isCampaignManager={props.isCampaignManager}
      />
    )}
  </WhiteListConsumer>
);


const mapStateToProps = (state, ownProps) => {
  const campaignId = parseInt(ownProps.match.params.id);
  const milestoneId = parseInt(ownProps.match.params.milestoneId);
  return {
    currentUser: selectCurrentUser(state),
    campaign: selectCampaign(state, campaignId),
    milestone: selectMilestone(state,milestoneId),
    isCampaignManager: selectCurrentUser(state).isCampaignManager(),
    reviewers: milestoneReviewers(state),
    recipients: recipients(state)
  }
}

const mapDispatchToProps = { saveMilestone }

export default connect(mapStateToProps,mapDispatchToProps)((withStyles(styles)(withTranslation()(EdtMilestone))));
