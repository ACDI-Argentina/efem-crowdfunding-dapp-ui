import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { history } from '../lib/helpers';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CustomDropdown from './CustomDropdown/CustomDropdown';
import styles from 'assets/jss/material-kit-react/components/headerLinksStyle.js';
import { withStyles } from '@material-ui/core/styles';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { withTranslation } from 'react-i18next';
import AboutUs from './Dialogs/AboutUs';

// Broken rule that can not find the correct id tag
/* eslint jsx-a11y/aria-proptypes: 0 */
/**
 * The main top menu
 * 
 * TODO Eliminar
 * 
 */
class MainMenu extends Component {
  constructor(props){
    super(props);
    this.state = {
      showAboutUs: false,
    }
  }
  componentDidMount() {
    // when route changes, close the menu
    history.listen(() => this.setState({ showMobileMenu: false }));
  }

  toggleMobileMenu() {
    this.setState((prevState) => ({ showMobileMenu: !prevState.showMobileMenu }));
  }

  render() {
    const { classes, currentUser,t } = this.props;
    const registered = (currentUser && currentUser.registered) || false;


    const labels = {
      welcome: t('menuWelcome'),
      profile: t('menuProfile'),
      signup: t('menuSignup'),
      aboutUs: t('aboutUs')
    }

    let buttonText;
    if (currentUser?.name) {
      buttonText = currentUser.name;
    } else {
      buttonText = labels.welcome;
    }

    const profileText = registered ? labels.profile : labels.signup;
    const profileLink = (
      <NavLink className={classes.dropdownLink} to="/profile">
        {profileText}
      </NavLink>
    );

    const aboutUs = (
      <div
        className={classes.dropdownLink}
        onClick={() => {
          this.setState({showAboutUs: true})
        }}>
        {labels.aboutUs}
      </div>
    );

    return (
      <>
      <List className={classes.list}>

        {currentUser && (
          <ListItem className={classes.listItem}>
            <CustomDropdown
              noLiPadding
              buttonText={<span>{buttonText}</span>}
              buttonProps={{
                className: classes.navLink,
                color: 'transparent',
              }}
              dropdownList={[
                profileLink
                ]}
            />
          </ListItem>
        )}
      </List>
      <AboutUs
        fullWidth={true}
        maxWidth="sm"
        open={this.state.showAboutUs}
        onClose={() => {
            console.log('close modal')
            this.setState({showAboutUs:false})
        }}
        
        >
      </AboutUs>
      </>
    );
  }
}

MainMenu.contextType = Web3AppContext;

const mapStateToProps = (state, ownProps) => ({
  currentUser: selectCurrentUser(state),
});
const mapDispatchToProps = {};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withTranslation()(MainMenu))),
);

MainMenu.propTypes = {};
MainMenu.defaultProps = {};
