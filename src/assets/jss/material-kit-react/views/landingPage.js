import { container, title } from "assets/jss/material-kit-react.js";

import { dropShadowButton} from "assets/jss/material-kit-react/components/customButtonStyle.js";
import parallaxBkg from "assets/img/landing-bg.jpg";

const landingPageStyle = {

  background:  {
    backgroundImage: "url(" + parallaxBkg + ")",
    backgroundSize: "cover",
    height: "100vh"
  },

  landingPage: {
    overflowX: "hidden"
  },
  container: {
    zIndex: "12",
    color: "#FFFFFF",
    ...container
  },
  dappLogo: {
    maxHeight: "4em",
    "@media (max-width: 800px)": {
      maxHeight: "3em"
    },
    "@media (max-width: 600px)": {
      maxHeight: "2em"
    }
  },
  titleContainer: {
    padding: "3em",
    paddingTop: "10em",
    "@media (max-width: 600px)": {
      padding: "1em",
    }
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    margin: "0 10%",
    minHeight: "45px",
    color: "#FFFFFF",
    textDecoration: "none",
    textAlign: "center",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 1)",
    fontWeight: "600",
    width: "80%",
    margin: "0 10%",
    fontSize: "3em"
  },
  subtitle: {
    textAlign: "center",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 1)",
    fontWeight: "500",
    width: "60%",
    margin: "1rem 20%"
  },
  subtitleHighlight: {
    fontWeight: "600",
    color: "#43E0A9"
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    /*margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"*/
  },
  dropShadowButton: {
    ...dropShadowButton,
    margin: ".5em",
  }
};

export default landingPageStyle;
