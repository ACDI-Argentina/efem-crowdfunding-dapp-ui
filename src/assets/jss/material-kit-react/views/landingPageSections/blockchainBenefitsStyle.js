import { title, primaryColor } from "assets/jss/material-kit-react.js";

const blockchainBenefitsStyle = {

  color: "#999",

  section: {
    padding: "0",
    textAlign: "left",
    marginTop: "5em"
  },
  title: {
    ...title,
    minHeight: "32px",
    textDecoration: "none",
    color: "#000",
    width: "50%",
    margin: "0 auto 1em auto",
    textAlign: "center"
  },
  image: {
    width: "20%",
    maxWidth: "80px",
    "@media (max-width: 600px)": {
      marginLeft: "20%"
    }
  },
  sectionTitle: {
    color: "#000",
    fontWeight: "bold",
    marginTop: "0.5em",
    marginBottom: "0.5em",
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

export default blockchainBenefitsStyle;
