import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import config from '../configuration';

import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from 'components/CustomButtons/Button.js';
import styles from 'assets/jss/material-kit-react/components/headerLinksStyle.js';
import { withStyles } from '@material-ui/core/styles';
import Flag from 'react-flagkit';

const ActiveIndicator = styled.div`
  border: 1px solid #53a653;
  backGround-color: #53a653;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;
const FlagContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 2px;
`;

/**
 * Selecciona de idioma de la aplicación.
 */
class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: config.language.default,
    };
    this.changeValue = this.changeValue.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
  }

  componentDidMount() {
    const { i18n } = this.props;
    this.setState({ value: i18n.language });
  }

  changeValue(newVal) {
    let value = newVal;
    this.setState({ value });
    this.setLanguage(value);
  }

  /**
   * Cambia el lenguaje de la aplicación a través del API de react-i18next.
   *
   */
  setLanguage(language) {
    const { i18n } = this.props;
    i18n.changeLanguage(language);
  }

  render() {
    const { classes } = this.props;
    const currentValue = this.state.value;

    const options = config.language.options.map((language) => (
        <Button
          key={language.key}
          color={'primary'}
          title={language.name}
          justIcon
          link
          className={classes.margin5}
          onClick={() => this.changeValue(language.key)}
        >
          <FlagContainer>
            <Flag country={language.flag} value={language.key} />
            {currentValue === language.key && <ActiveIndicator />}
          </FlagContainer>
        </Button>
    ));

    
    return <div className={classes.flagsListContainer}>{options}</div>;
  }
}
export default withTranslation()(withStyles(styles)(LanguageSelector));
