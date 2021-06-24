import { title, primaryColor } from "assets/jss/material-kit-react.js";

const footerStyle = {

  color: "#999",

  section: {
    color: "#000",
    padding: "0",
    textAlign: "left",
    marginTop: "2em"
  },
  dappLogo: {
    padding: "1em 1em 1em 0em",
    width: "100%",
    textAlign: "left",
    maxWidth: "300px"
  },
  leftSection: {
    textAlign: "right",
    "@media (max-width: 600px)": {
      textAlign: "left"
    }
  },
  rightSection: {
    borderLeft: "2px solid #999",
    alignSelf: "center",
    padding: "1em",
    "@media (max-width: 600px)": {
      borderLeft: "0px",
      paddingLeft: "0em"
    }
  },
  title: {
    color: "#10B363",
    fontWeight: "bold",
    margin: "0",
    marginBottom: "0.5em"
  },
  description: {
    color: "#000",
    fontWeight: "normal",
    margin: "0"
  },
  disclaimer: {
    color: "#000",
    fontWeight: "normal",
    margin: "0",
    textAlign: "center"
  },
  logo: {
    width: "75%",
    textAlign: "center",
    maxWidth: "100px"
  },
  smallLogo: {
    maxWidth: "30px",
    marginRight: "10px"
  }
};

export default footerStyle;
