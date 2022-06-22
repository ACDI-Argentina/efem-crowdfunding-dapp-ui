import { primaryColor } from "assets/jss/material-kit-react.js";

import { dropShadowButton } from "assets/jss/material-kit-react/components/customButtonStyle.js";

const platformFeaturesStyle = {

  color: "#999",

  container: {
    padding: "10em 0",
    alignItems: "center"
  },
  paragraphText: {
    fontWeight: "400",
    fontSize: "1.5em",
    lineHeight: "1.5em"
  },
  paragraphTextHighlight: {
    fontWeight: "500",
    color: primaryColor
  },
  knowPlatformImg: {
    width: "60%"
  },
  dropShadowButton: {
    ...dropShadowButton,
    marginTop: "2em",
    border: "1px solid",
    borderColor: primaryColor,
  }
  

};

export default platformFeaturesStyle;
