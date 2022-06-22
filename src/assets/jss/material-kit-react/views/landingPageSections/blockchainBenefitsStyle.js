import { title, primaryColor } from "assets/jss/material-kit-react.js";

const blockchainBenefitsStyle = {

  color: "#999",

  container: {
    alignItems: "center",
    color: "#fff",
    padding: "4em 0"
  },

  title: {
    ...title,
    color: primaryColor,
    padding: "0",
    margin: "0",
    marginBottom: ".5em"
  },

  subtitle: {
    color: "#000",
    padding: "0",
    margin: "0",
  },

  separator: {
    padding: "1em",
  },

  sectionTitle: {
    fontWeight: "600",
    fontSize: "30px",
    marginBottom: ".5em"
  },

  sectionDescription: {
    color: "#fff",
    fontWeight: "normal",
    fontSize: "25px",
    lineHeight: "1.5em"
  },

  image: {
    width: "40%",
    padding: "2em 0 1em 0"
  },

  section: {
    padding: "0",
    textAlign: "center",
    marginTop: "3em"
  },
  description: {
    color: "#000",
    width: "40%",
    margin: "0 auto 1em auto",
    fontWeight: "normal"
  },

  legend: {
    textAlign: "center",
    color: "#454545",
    padding: ".5em",
    fontWeight: "400",
    fontSize: ".9em"
  },

  card: {
    borderRadius: "5px",
    height: "100%",
    "&:hover": {
      borderRadius: "5px",
      boxShadow: "8px 8px 0px 0px rgba(67,224,169,0.75)",
      textTransform: "none",
    }
  }

};

export default blockchainBenefitsStyle;
