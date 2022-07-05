import React from 'react'
import { makeStyles } from "@material-ui/core";
import bkgImg from "assets/img/background.jpg";

const Background = ({ children, ...props }) => {
  const classes = makeStyles(styles)();
  return (
    <div className={classes.root}>
      <div className={classes.panelGlass}>
        {children}
      </div>
    </div>
  );
}

const styles = theme => ({
  root: {
    padding: "3em",
    paddingTop: "8em",
    backgroundImage: "url(" + bkgImg + ")",
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center center',
    backgroundSize: '10%'
  },
  panelGlass: {
    border: '1px solid #FFF',
    borderRadius: '5px',
    padding: "2em",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(5px)"
  }
});

export default Background;