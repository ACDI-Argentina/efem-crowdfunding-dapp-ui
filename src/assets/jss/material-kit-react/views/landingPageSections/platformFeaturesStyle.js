import { title, primaryColor } from "assets/jss/material-kit-react.js";

const platformFeaturesStyle = {

  color: "#999",

  section: {
    padding: "0",
    textAlign: "center",
    marginTop: "3em"
  },
  title: {
    ...title,
    minHeight: "32px",
    textDecoration: "none",
    color: "#000",
    width: "50%",
    margin: "0 auto 0.5em auto"
  },
  description: {
    color: "#000",
    width: "40%",
    margin: "0 auto 1em auto",
    fontWeight: "normal"
  },
  image: {
    width: "50%",
    maxWidth: "120px",
  },
  sectionTitle: {
    color: primaryColor,
    fontWeight: "bold",
    marginBottom: "1em",
    "@media (max-width: 600px)": {
      maxWidth: "60%",
      marginLeft: "20%"
    }
  },
  sectionDescription: {
    color: "#000",
    fontWeight: "normal",
    "@media (max-width: 600px)": {
      maxWidth: "60%",
      marginLeft: "20%"
    }
  },
  underlineHighlight: {
    textDecoration: "underline",
    textDecorationColor: "#10B363"
  },
  colorHighlight: {
    color: primaryColor
  },
  boldText: {
    fontWeight: "600"
  },
  italicText: {
    fontStyle: "italic"
  }
};

export default platformFeaturesStyle;
