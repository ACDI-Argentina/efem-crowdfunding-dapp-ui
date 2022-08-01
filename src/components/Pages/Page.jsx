import React from 'react'
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from 'react-i18next';

const Page = ({ children, ...props }) => {
  const classes = makeStyles(styles)();
  const { t } = useTranslation();
  return (
    <div className={classes.root}>
      {props.showHeader && <Header fixed {...props} />}
      <div className={classes.panel}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

Page.defaultProps = {
  showHeader: true
}

export default Page;

const styles = theme => ({
  root: {
    overflowX: "hidden"
  },
  panel: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "0",
    margin: "0",
    padding: '0',
    flexGrow: 1,
    minHeight: "75vh",
    width: "100vw"

  }
});
