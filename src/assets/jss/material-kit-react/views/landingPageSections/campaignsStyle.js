import { title, primaryColor } from "assets/jss/material-kit-react.js";

const campaignsStyle = {

  color: "#999",

  section: {
    padding: "0",
    textAlign: "left"
  },
  title: {
    ...title,
    marginBottom: "1rem",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
    color: "#000"
  },
  description: {
    color: "#000",
    margin: "0 auto 1em auto",
    fontWeight: "normal"
  },
  cardHeader: {
    width: "auto",
    border: "0",
    padding: "5px 2px",
    textAlign: "center",
    marginTop: "0px",
    marginLeft: "0px",
    marginRight: "0px",
    marginBottom: "15px",
    background: "none",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
    borderRadius: "0",
    "flexContainer": {
      display: "flex",
      flexWrap: "space-around"
    },
  },

};

export default campaignsStyle;
