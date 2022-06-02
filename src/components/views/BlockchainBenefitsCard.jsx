import React, { Component } from 'react';
import styles from "assets/jss/material-kit-react/views/landingPageSections/blockchainBenefitsStyle.js";
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

/**
 * The BlockchainBenefitsCard section
 */
class BlockchainBenefitsCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { backgroundColor, iconSrc, legend, classes} = this.props;

    return (
        <Box className={classes.card} style={{ backgroundColor: backgroundColor }}>
            <center>
              <img src={iconSrc} className={classes.image} />
              <div className={classes.legend}>{legend}</div>
            </center>
        </Box>
    )
  }
}

BlockchainBenefitsCard.propTypes = {};

export default withTranslation()((withStyles(styles)(BlockchainBenefitsCard)))
