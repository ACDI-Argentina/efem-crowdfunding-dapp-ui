import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";
import { withStyles } from '@material-ui/core/styles';
import { Box, Checkbox, FormControlLabel} from '@material-ui/core';
import { ALL_CATEGORIES } from '../constants/Categories';

/**
 * Selecciona de idioma de la aplicación.
 */
class CategorySelector extends Component {

    constructor(props) {
        super(props);
        this.state = { value: [] };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        console.log(this.props.value);
        this.setState({ value: this.props.value });
    }

    handleChange(event, catId) {
        let array = [...this.state.value];
        let index = array.indexOf(catId);
        if (index !== -1) {
            array.splice(index, 1);
        } else {
            array.push(catId);
        }
        this.setState({value: array});
        this.props.setCategories(array);
    }

    render() {
        const {t} = this.props;

        const options = ALL_CATEGORIES.map(cat => (
            <Box key={cat}>
                <FormControlLabel
                    control={
                        <Checkbox checked={(this.state.value.indexOf(cat) !== -1)}
                        onChange={(event) => this.handleChange(event, cat)} key={cat} />
                        }
                    label={t('campaignCategories' + cat + 'Label')}
                />
            </Box>
        ));
        return (
            <div>
                <label className="control-label">{this.props.label}</label>
                <Box m={0} display="flex" justifyContent="space-evenly">
                    {options}
                </Box>
                <span className="help-block">{this.props.helpText}</span>
            </div>
        );
    }
}

export default (withStyles(styles)(withTranslation()(CategorySelector)))