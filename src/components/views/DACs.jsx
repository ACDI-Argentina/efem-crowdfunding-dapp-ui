import React, { Component } from 'react';
import DACCard from '../DacCard';
import Loader from '../Loader';
import { connect } from 'react-redux'
import { selectDacs } from '../../redux/reducers/dacsSlice'
import { withTranslation } from 'react-i18next';

import styles from "assets/jss/material-kit-react/views/landingPageSections/dacsStyle.js";
import { withStyles } from '@material-ui/core/styles';

import Badge from "components/Badge/Badge.js";

/**
 * The DACs view mapped to /dacs
 */
class DACs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  render() {
    const { classes, t, dacs } = this.props;
    const { isLoading, hasError } = this.state;
    // TODO Por incorporación de Redux, se fija el total
    // como el tamaño de los milestones.
    // Falta el desarrollo del Paginado.
    var total = dacs.length;
    return (
      <div id="campaigns-view" className="card-view">
        <div className={classes.section}>
          <h2 className={classes.title}>{t('dacs')} {total > 0 && <Badge color="success">{total}</Badge>}</h2>
          <h6 className={classes.description}>
            {t('dacsSectionDescription')}
          </h6>
          {!hasError && isLoading && <Loader />}
          {// There are some DACs in the system, show them
          !hasError && !isLoading && dacs.length > 0 && (
            <div>
              <div className="cards-grid-container">
                {dacs.map(dac => (
                  <DACCard key={dac.clientId || dac.id} dac={dac} />
                ))}
              </div>
            </div>
          )}

          {// There are no DACs, show empty state
          !hasError && !isLoading && dacs.length === 0 && (
            <div>
              <center>
                <p className={classes.description}>&iexcl;A&uacute;n no hay DACs!</p>
                <img
                  className="empty-state-img"
                  src={`${process.env.PUBLIC_URL}/img/community.svg`}
                  width="200px"
                  height="200px"
                  alt="no-campaigns-icon"
                />
              </center>
            </div>
          )}
          {hasError && (
            <p>
              <strong>Oops, something went wrong...</strong> The B4H dapp could not load any Funds
              for some reason. Please try refreshing the page...
            </p>
          )}
        </div>
      </div>
    );
  }
}


DACs.propTypes = {};

const mapStateToProps = (state, ownProps) => {
  return {
    dacs: selectDacs(state)
  }
}

export default connect(mapStateToProps)(
  withTranslation()((withStyles(styles)(DACs))
))