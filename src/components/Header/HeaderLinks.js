/*eslint-disable*/
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import { connect } from 'react-redux';
import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import Web3App from "../../lib/blockchain/Web3App";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {

  const classes = useStyles();

  const { currentUser } = props;
  const registered = currentUser && currentUser.registered || false;

  return (
    <Web3App.Consumer>
      {({
        validProvider,
        isEnabled,
        failedToLoad
      }) => (
          <List className={classes.list}>

            {validProvider && !failedToLoad && isEnabled && !currentUser && (
              <small className="text-muted">Please unlock your wallet</small>
            )}
            {!validProvider && (
              <ListItem className={classes.listItem}>
                <Button
                  color="transparent"
                  target="_blank"
                  className={classes.navLink}
                  onClick={signUpSwal}
                >
                  Reg&iacute;strate!
                </Button>
              </ListItem>
            )}

            {currentUser && (
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownYou"
                  to="/"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {currentUser.avatar && (
                    <Avatar
                      className="menu-avatar"
                      size={30}
                      src={currentUser.avatar}
                      round
                    />
                  )}

                  {currentUser.name && <span>{currentUser.name}</span>}

                  {!currentUser.name && <span>&iexcl;Hola!</span>}
                </Link>
                <div
                  className={`dropdown-menu dropdown-profile ${showMobileMenu ? 'show' : ''}`}
                  aria-labelledby="navbarDropdownYou"
                >
                  <NavLink className="dropdown-item" to="/profile">
                    {registered ? <span>Perfil</span> : <span>Reg&iacute;strate</span>}
                  </NavLink>
                </div>
              </li>
            )}
          </List>
        )}
    </Web3App.Consumer>
  );
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: selectCurrentUser(state)
});
const mapDispatchToProps = {};

const HeaderLinksConnected = connect(mapStateToProps, mapDispatchToProps)(HeaderLinks);

//export default withRouter(HeaderLinksConnected);


