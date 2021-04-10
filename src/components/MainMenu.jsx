import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { history } from '../lib/helpers';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import LanguageSelector from '../components/LanguageSelector'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "components/CustomButtons/Button.js";
import CustomDropdown from './CustomDropdown/CustomDropdown';
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import { withStyles } from '@material-ui/core/styles';
import { AppTransactionContext } from 'lib/blockchain/Web3App';

const signUpSwal = () => {
  React.swal({
    title: 'Sign Up!',
    content: React.swal.msg(
      <p>
        In order to use the Dapp, you need to use a Web3 wallet.
        <br />
        It is recommended that you install <a href="https://metamask.io/">MetaMask</a>.
      </p>,
    ),
    icon: 'info',
    buttons: ['Ok'],
  });
};
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
    const { validProvider, isEnabled, failedToLoad } = this.context;

    const addr = currentUser?.address;
    
    return (
      <List className={classes.list}>
        
        <ListItem className={classes.listItem}>
          
          { currentUser.address && (
            `${addr.slice(0,4)}...${addr.slice(-4)}`
          )}
          {!currentUser.address && (
            <button onClick={() => this.context.initAccount()}>
              Connect
            </button> 
          )}
        </ListItem>
        <ListItem className={classes.listItem}>
          <LanguageSelector ></LanguageSelector>
        </ListItem>

        {validProvider && !failedToLoad && !isEnabled && (
          <ListItem className={classes.listItem}>
            <Button
              color="transparent"
              className={classes.navLink}
              onClick={signUpSwal}
            >
              Reg&iacute;strate!
            </Button>
          </ListItem>
        )}

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

MainMenu.contextType = AppTransactionContext;

const mapStateToProps = (state, ownProps) => ({
  currentUser: selectCurrentUser(state)
});
const mapDispatchToProps = { };

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(MainMenu)))

MainMenu.propTypes = {};
MainMenu.defaultProps = {};
