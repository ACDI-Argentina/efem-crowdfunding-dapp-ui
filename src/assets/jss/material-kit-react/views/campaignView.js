import { container, title, primaryColor } from "assets/jss/material-kit-react.js";

const landingPageStyle = {
  campaignView: {
    overflowX: "hidden"
  },
  container: {
    zIndex: "12",
    color: "#212529",
    ...container
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
    zIndex: "-1"
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
    maxHeight: "2.5em"
  },
  bottomSeparator: {
    width: "100vw",
    marginLeft: "calc((100% - 100vw)/2)"
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
    }
  },
};

export default landingPageStyle;
