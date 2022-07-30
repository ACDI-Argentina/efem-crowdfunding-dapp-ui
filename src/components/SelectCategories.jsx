import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import config from 'configuration';
import CategoryChip from './CategoryChip';
import CategoryChipList from './CategoryChipList';

class SelectCategories extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  };

  render() {
    const { id, value, classes, t } = this.props;

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };

    if (config.categories.length === 0) {
      // No hay categorias para seleccionar.
      return (
        <Typography variant="subtitle1">
          {t('categoriesEmpty')}
        </Typography>
      )
    }

    return (
      <FormControl className={classes.root}>
        <InputLabel id={`select-categories-${id}-label`}>
          {t('categories')}
        </InputLabel>
        <Select
          id={`select-categories-${id}`}
          labelId={`select-categories-${id}-label`}
          multiple
          value={value}
          onChange={this.handleChange}
          input={<Input />}
          renderValue={(selected) => (
            <CategoryChipList categoryIds={selected}></CategoryChipList>
          )}
          MenuProps={MenuProps}>
          {config.categories.map(cat => (
            <MenuItem key={cat} value={cat}>
              <Checkbox checked={this.props.value.indexOf(cat) > -1} />
              <ListItemText primary={t(`category${cat}Label`)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
}

const styles = theme => ({
  root: {
    minWidth: 120,
    width: '100%'
  }
});

SelectCategories.propTypes = {

};

const mapStateToProps = (state, props) => {
  return {

  }
}
const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    withTranslation()(SelectCategories)
  ));