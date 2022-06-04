import { title, primaryColor } from "assets/jss/material-kit-react.js";

import { dropShadowButton } from "assets/jss/material-kit-react/components/customButtonStyle.js";

import backgroundImg from "assets/img/supportG4F.jpg";

const platformFeaturesStyle = {

  color: "#999",

  container: {
    margin: "3em 0",
    backgroundColor: "#43E0A9"
  },
  leftContainer: {
    width: "80%",
    padding: "4em 2em"
  },
  title: {
    ...title,
    marginTop: "0em"
  },
  paragraphText: {
    fontWeight: "400",
    fontSize: "1.3em",
    lineHeight: "1.3em"
  },
  paragraphTextHighlight: {
    fontWeight: "500",
    color: primaryColor
  },
  supportBackgroundImg: {
    backgroundImage: "url(" + backgroundImg + ")",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#000",
    flexGrow: "1",
    "&:after": {
      content: "''",
      backgroundColor: "rgba(22, 222, 222, 0.5)",
    }
  },
  dropShadowButton: {
    ...dropShadowButton,
    borderRadius: "5px",
    boxShadow: "3px 3px 0px 0px " + primaryColor,
    textTransform: "none",
    backgroundColor: "#004634",
    color: "#FFF",
    marginTop: "2em"
  }
  

};

export default platformFeaturesStyle;
