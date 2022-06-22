import {
  primaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor
} from "assets/jss/material-kit-react.js";

const customLinearProgressStyle = {
  root: {
    borderRadius: "10px",
    height: "10px",
    marginBottom: "1em",
    overflow: "hidden",
    backgroundColor: "#EEE"
  },
  bar: ({ value }) => ({
    height: "100%",
    background: `linear-gradient(90deg, #6fcbb6 0%, #004634 100%)`,
    backgroundSize: `${value}% 100%`,
    backgroundRepeat: `no-repeat`
  }),
  primary: {
    backgroundColor: primaryColor
  },
  warning: {
    backgroundColor: warningColor
  },
  danger: {
    backgroundColor: dangerColor
  },
  success: {
    backgroundColor: successColor
  },
  info: {
    backgroundColor: infoColor
  },
  rose: {
    backgroundColor: roseColor
  },
  gray: {
    backgroundColor: grayColor
  }
};

export default customLinearProgressStyle;
