import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from "classnames";

import { history } from '../../lib/helpers';
import { registerCurrentUser, selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { withStyles } from '@material-ui/core/styles';

import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainMenu from 'components/MainMenu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-kit-react/views/profilePage.js";
import ProfileForm from 'components/ProfileForm';
import Loader from '../Loader';
import { connect } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';

/**
 * Edición del usuario actual.
 *
 * @param currentUser  The current user
 */
class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  async requestConnection(translate){ 
    
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
      
      buttons: [labels.cancel,labels.ok],
      closeOnClickOutside: false,
    });

    return confirm;

  }

  async componentDidMount() {
    const { history, currentUser, t: translate } = this.props;
    const { loginAccount } = this.context;
    const { authenticateIfPossible } = this.context.modals.methods;

    const goHome = () => history.push('/');

    if(!currentUser || !currentUser.address){
      const confirmation = await this.requestConnection(translate);
      if(confirmation){
        const connected = await loginAccount();
        if(!connected){
          return goHome();
        }
      } else {
        return goHome();
      }
    }
    
    authenticateIfPossible(this.props.currentUser)
      .then(() => this.setState({ isLoading: false }))
      .catch(err => {
        if (err === 'noBalance') {
          history.goBack();
        } else {
          this.setState({ isLoading: false });
        }
      }); 
  }

  render() {
    const { isLoading } = this.state;
    const { currentUser } = this.props;
    const { ...rest } = this.props;
    const { classes, t } = this.props;

    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );


    return (
      <div className={classes.profilePage}>
        <Header
          color="white"
          brand={<img src={require("assets/img/logos/give4forest.png")}
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
        <Parallax small image={require("assets/img/profile-default-bg.jpg")} />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div>
                      <img src={currentUser.avatar ? currentUser.avatar : require("assets/img/default-user-icon.png")} alt="..." className={imageClasses} />
                    </div>
                    {isLoading && <Loader className="fixed" />}
                    {!isLoading && (
                      <div>
						{currentUser.email && <h3>Edit your profile</h3>}
						{!currentUser.email && <h3>Create a profile to get started</h3>}
                        <p>
                          <i className="fa fa-question-circle" />
      Trust is important to run successful Funds or Campaigns. Without trust you will
      likely not receive donations. Therefore, we strongly recommend that you{' '}
                          <strong>fill out your profile </strong>
      when you want to start Funds or Campaigns on the B4H dapp.
    </p>
                        <div className="alert alert-warning">
                          <i className="fa fa-exclamation-triangle" />
                            Please note that all the information entered will be stored on a publicly
                            accessible permanent storage like blockchain. We are not able to erase or alter
                            any of the information.{' '}
                          <strong>
                            Do not input anything that you do not have permision to share or you are not
                            comfortable with being forever accessible.
                          </strong>{' '}
                          For more information please see our{' '}
                          <Link to="/termsandconditions">Terms and Conditions</Link> and{' '}
                          <Link to="/privacypolicy">Privacy Policy</Link>.
                        </div>

                      <ProfileForm user={currentUser}/>
                      </div>
                    )}

                  </div>
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

EditProfile.contextType = Web3AppContext;

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectCurrentUser(state)
  };
}
const mapDispatchToProps = { registerCurrentUser }

export default connect(mapStateToProps,mapDispatchToProps)((withStyles(styles)(
  withTranslation()(EditProfile)))
);