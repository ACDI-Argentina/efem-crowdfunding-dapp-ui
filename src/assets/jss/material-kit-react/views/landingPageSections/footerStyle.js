import { fontSize } from "styled-system";
import { primaryColor } from "assets/jss/material-kit-react.js";

const footerStyle = {

  color: "#999",

  section: {
    color: "#000",
    padding: "0",
    textAlign: "left",
    backgroundColor: "#004634"
  },
  dappLogo: {
    padding: "1em 0",
    maxHeight: "180px",
    position: "absolute",
    top: "-120px"
  },
  leftSection: {
    "@media (max-width: 600px)": {
      textAlign: "left"
    }
  },
  socialMediaIcon: {
    maxWidth: "30px",
    maxHeight: "30px",
    marginLeft: "20px"
  },
  sectionlink: {
    color: "#FFF",
    textTransform: "uppercase",
    marginRight: "40px",
    fontSize: ".8em",
    "&:hover,&:focus": {
      color: primaryColor
    },
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
    color: "#FFF",
    fontWeight: "normal",
    padding: "1em",
    textAlign: "center",
    fontSize: ".7em",
    margin: "0",
  },
  link: {
    color: "#FFF",
    "&:hover,&:focus": {
      color: primaryColor
    },
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
