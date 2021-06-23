import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import config from '../configuration';

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "components/CustomButtons/Button.js";
import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import { withStyles } from '@material-ui/core/styles';
import Flag from 'react-flagkit';

/**
 * Selecciona de idioma de la aplicación.
 */
class LanguageSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: config.language.default
        };
        this.changeValue = this.changeValue.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
    }

    changeValue(newVal) {
        let value = newVal;
        this.setState({value});
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

        const options = config.language.options.map(language => (
            <ListItem key={language.key} className={classes.listItem}>
                <Button title={language.name} justIcon link className={classes.margin5}>
                    <Flag country={language.flag} value={language.key} onClick={() => this.changeValue(language.key)} />
                </Button>
            </ListItem>
        ));
        return (
            <List className={classes.list}>
                {options}
            </List>
        );
    }
}
export default withTranslation()(withStyles(styles)(LanguageSelector));