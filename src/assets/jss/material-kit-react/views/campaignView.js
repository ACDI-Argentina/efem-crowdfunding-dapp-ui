import { container, title, primaryColor } from "assets/jss/material-kit-react.js";

const landingPageStyle = {
  campaignView: {
    overflowX: "hidden"
  },
  container: {
    zIndex: "12",
    color: "#212529",
    ...container,

  },
  campaignDescriptionContainer: {
    "& img": {
      maxWidth: "100%",
      height: "auto"
    }
  },
  headerContainer: {
    margin: "0 30px",
    width: "calc(100% - 60px)"
  },
  campaignHeader: {
    margin: "0 auto"
  },
  avatar: {
    width: "130px",
    height: "130px",
    margin: "0 auto"
  },
  parallax: {
    backgroundPositionY: '100%',
  },
  entityType: {
    color: "#555",
    margin: "0",
    textAlign: 'center'
  },
  entityName: {
    color: "#000",
    margin: "0.5em 0",
    fontWeight: "600",
    lineHeight: "1.2em",
    margin: "0 auto",
    textAlign: "center",
    maxWidth: "80%",
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    margin: "30px",
    minHeight: "32px",
    color: "#212529",
    textDecoration: "none"
  },
  subtitle: {
    fontSize: "1.313rem",
    maxWidth: "500px",
    margin: "10px auto 0"
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
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
  bottomSeparator: {
    width: "100vw",
    marginLeft: "calc((100% - 100vw)/2)"
  },
  cardHeader: {
    width: "auto",
    border: "0",
    padding: "5px 0px",
    textAlign: "center",
    marginTop: "0px",
    marginLeft: "0px",
    marginRight: "0px",
    marginBottom: "15px",
    background: "none",
    border: "none",
    "flexContainer": {
      display: "flex",
      flexWrap: "space-around"
    }
  },
  description: {
    color: "#000",
    margin: "0 auto 1em auto",
    fontWeight: "normal"
  }
};

export default landingPageStyle;
