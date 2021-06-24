import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { history } from '../lib/helpers';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import LanguageSelector from '../components/LanguageSelector'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CustomDropdown from './CustomDropdown/CustomDropdown';
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import { withStyles } from '@material-ui/core/styles';
import { Web3AppContext } from 'lib/blockchain/Web3App';

// Broken rule that can not find the correct id tag
/* eslint jsx-a11y/aria-proptypes: 0 */
/**
 * The main top menu
 */
class MainMenu extends Component {
  
  
  componentDidMount() {
    // when route changes, close the menu
    history.listen(() => this.setState({ showMobileMenu: false }));
  }

  toggleMobileMenu() {
    this.setState(prevState => ({ showMobileMenu: !prevState.showMobileMenu }));
  }

  render() {
    const { classes, currentUser } = this.props;
    const registered =  currentUser && currentUser.registered || false;

    return (
      <List className={classes.list}>



        <ListItem className={classes.listItem}>
          <LanguageSelector ></LanguageSelector>
        </ListItem>

        {currentUser && (
          <ListItem className={classes.listItem}>
            <CustomDropdown
              noLiPadding
              buttonText={(currentUser.name && <span>{currentUser.name}</span>) ||
                          (!currentUser.name && <span>&iexcl;Hola!</span>)}
              buttonProps={{
                className: classes.navLink,
                color: "transparent"
              }}
              dropdownList={[
                <NavLink className={classes.dropdownLink} to="/profile">
                  {registered ? <span>Perfil</span> : <span>Reg&iacute;strate</span>} 
                </NavLink>
              ]}
            />
          </ListItem>
        )}
      </List>
    );
  }
}

MainMenu.contextType = Web3AppContext;

const mapStateToProps = (state, ownProps) => ({
  currentUser: selectCurrentUser(state)
});
const mapDispatchToProps = { };

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(MainMenu)))

MainMenu.propTypes = {};
MainMenu.defaultProps = {};
