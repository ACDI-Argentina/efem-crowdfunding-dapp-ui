import React, { Component } from 'react';
import { Prompt } from 'react-router-dom';
import classNames from "classnames";

import PropTypes from 'prop-types';
import { Form, Input } from 'formsy-react-components';
import Loader from '../Loader';
import QuillFormsy from '../QuillFormsy';
import FormsyImageUploader from '../FormsyImageUploader';
import GoBackButton from '../GoBackButton';
import { isOwner, history } from '../../lib/helpers';
import LoaderButton from '../LoaderButton';
import DAC from '../../models/DAC';
import User from '../../models/User';
import ErrorPopup from '../ErrorPopup';
import { connect } from 'react-redux'
import { saveDac, selectDac } from '../../redux/reducers/dacsSlice';
import { selectRoles , selectCurrentUser} from '../../redux/reducers/currentUserSlice';
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import { withStyles } from '@material-ui/core/styles';
import styles from "assets/jss/material-kit-react/views/dacPage.js";
import { Box } from '@material-ui/core';
import { AppTransactionContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';

/**
 * View to create or edit a DAC
 *
 * @param isNew    If set, component will load an empty model.
 *                 Otherwise component expects an id param and will load a DAC object
 * @param id       URL parameter which is an id of a campaign object
 * @param history  Browser history object
 */
class EditDAC extends Component {
  constructor(props) {
    super(props);

    // DAC model
    const dac = new DAC({ 
      delegateAddress: props.currentUser && props.currentUser.address,
      status: DAC.PENDING
    });

    this.state = {
      isLoading: true, 
      isSaving: false,
      formIsValid: false,
      dac: dac,
      isBlocking: false,
    };

    this.form = React.createRef();

    this.submit = this.submit.bind(this);
    this.setImage = this.setImage.bind(this);
  }

  componentDidMount() {
    console.log("component did mount")

    this.checkUser().then(() => {
      const isEditingDac = !this.props.isNew;
      if (isEditingDac) {
        const dac = this.props.dac;
        this.setState({ dac, isLoading: false });
      } else { //dac is new
        this.setState({ isLoading: false });
      }
    }).catch(err => {
      console.log(err);
      ErrorPopup('There has been a problem loading the Fund. Please refresh the page and try again.',err);
    });
    this.mounted = true;
  }

  componentDidUpdate(prevProps) {
    /*if (prevProps.user !== this.props.user) {
      this.checkUser().then(() => {
        if (!this.props.isNew && !isOwner(this.state.dac.delegateAddress, this.props.user))
          history.goBack();
      });
    }*/
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setImage(image) {
    const { dac } = this.state;
    dac.image = image;
    this.setState({ dac });
  }

  checkUser() {

    const { currentUser } = this.props;
    const { authenticateIfPossible, checkProfile } = this.context.modals.methods;

    if (!currentUser) { //Si no hay nadie logeado?
      history.push('/');
      return Promise.reject("Not allowed. No user logged in");
    }

    if(!this.props.isDelegate){
      history.push('/');
      return Promise.reject("Not allowed. User is not delegate");
    }

    return authenticateIfPossible(currentUser)
          .then(() => checkProfile(currentUser));
  }

  submit() {
    const afterSave = dac => {
      history.push(`/`);
    };
    
    this.setState({ isSaving: true, isBlocking: false }, () => {
        this.props.saveDac(this.state.dac);
        afterSave(this.state.dac);
      },
    );
  } //End save 

  toggleFormValid(state) {
    this.setState({ formIsValid: state });
  }

  triggerRouteBlocking() {
    const form = this.form.current.formsyForm.current;
    // we only block routing if the form state is not submitted
    this.setState({ isBlocking: form && (!form.state.formSubmitted || form.state.isSubmitting) });
  }

  render() {
    const { isNew, t } = this.props;
    const { isLoading, isSaving, dac, formIsValid, isBlocking } = this.state;

    const { ...rest } = this.props;
    const { classes } = this.props;

    return (
      <div id="edit-dac-view">
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

        {isNew && <Parallax small image={require("assets/img/dac-default-bg.jpg")}/>}
        {!isNew && <Parallax small image={dac.imageCidUrl}/>}
        
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
                        {isNew && <h3>Start a Decentralized Fund</h3>}

                        {!isNew && <h3>Edit Fund</h3>}

                        <p>
                          <i className="fa fa-question-circle" />A Fund aims to solve a cause by raising
                          funds and delegating those funds to Campaigns that solve its cause. Should you
                          create a Campaign or Fund? Read more{' '}
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://wiki.giveth.io/documentation/glossary/"
                          >
                            here
                          </a>
                          .
                        </p>
                      </div>

                      <Form
                        onSubmit={this.submit}
                        ref={this.form}
                        mapping={inputs => {
                          dac.title = inputs.title;
                          dac.description = inputs.description;
                          dac.url = inputs.communityUrl;
                        }}
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
                          id="title-input"
                          label="Fund cause"
                          type="text"
                          value={dac.title}
                          placeholder="e.g. Hurricane relief."
                          help="Describe your Decentralized Fund in 1 sentence."
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
                            label="Explain your cause"
                            helpText="Make it as extensive as necessary. Your goal is to build trust,
                            so that people donate to your Fund."
                            value={dac.description}
                            placeholder="Describe how you're going to solve your cause..."
                            validations="minLength:20"
                            help="Describe your cause."
                            validationErrors={{
                              minLength: 'Please provide at least 10 characters.',
                            }}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <FormsyImageUploader
                            name="image"
                            setImage={this.setImage}
                            previewImage={dac.imageCidUrl}
                            isRequired={isNew}
                          />
                        </div>

                        <div className="form-group">
                          <Input
                            name="communityUrl"
                            id="community-url"
                            label="Url to join your community"
                            type="text"
                            value={dac.url}
                            placeholder="https://slack.giveth.com"
                            help="Where can people join your community? Paste a link here for your community's website, social or chatroom."
                            validations="isUrl"
                            validationErrors={{
                              isUrl: 'Please provide a url.',
                            }}
                          />
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
                                disabled={isSaving || !formIsValid || (dac.id && dac.delegateId === 0)}
                                isLoading={isSaving}
                                loadingText="Saving..."
                              >
                                {isNew ? 'Create Fund' : 'Update Fund'}
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

EditDAC.contextType = AppTransactionContext;

EditDAC.propTypes = {
  user: PropTypes.instanceOf(User),
  isNew: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isDelegate: PropTypes.bool.isRequired,
};

EditDAC.defaultProps = {
  currentUser: undefined,
  isNew: false,
};

const mapStateToProps = (state, props) => {
  const dacId = parseInt(props.match.params.id);
  return {
    currentUser: selectCurrentUser(state),
    roles: selectRoles(state),
    isDelegate: selectCurrentUser(state).isDelegate(),
    dac: selectDac(state, dacId),
  }
};
const mapDispatchToProps = { saveDac }

export default connect(mapStateToProps,mapDispatchToProps)(
  (withStyles(styles)(withTranslation() (EditDAC)))  
);