import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Item from '../models/Item';
import { Form } from 'formsy-react-components';
import FormsyImageUploader from './FormsyImageUploader';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class AddItemDialog extends Component {

  constructor(props) {
    super(props);
    this.form = React.createRef();
    this.state = {
      open: false,
      item: new Item({}),
      formIsValid: false
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAttach = this.handleAttach.bind(this);
  }

  handleClickOpen() {
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.reset();
  }

  handleChangeDescription(event) {
    const { item } = this.state;
    item.description = event.target.value;
    this.setState({
      item: item
    });
    this.checkForm();
  };

  handleChangeImage(image) {
    const { item } = this.state;
    item.image = image;
    this.setState({ item });
    this.checkForm();
  }

  checkForm() {
    const { item } = this.state;
    const formIsValid = item.description != '' && item.image != '';
    this.setState({
      formIsValid: formIsValid
    });
  };

  handleAttach() {
    // Formsy doesn't like nesting, even when using Portals
    // So we're manually fetching and submitting the model
    // We need to call getModel here to set values on the MilestoneItem
    //this.form.current.formsyForm.getModel();
    this.form.current.formsyForm.current.getModel();
    // Get MilestoneItem
    this.props.onAddItem(this.state.item);
    this.reset();
  }

  reset() {
    this.setState({
      open: false,
      item: new Item({}),
      formIsValid: false,
    });
  }

  render() {
    const { open, item, formIsValid, isBlocking } = this.state;
    const { classes, t } = this.props;

    return (
      <div>
        <Button color="primary" onClick={this.handleClickOpen}>
          {t('itemAdd')}
        </Button>
        <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            {t('itemNewTitle')}
          </DialogTitle>
          <DialogContent>

            <Form
              id="milestone-proof-form"
              ref={this.form}
              layout="vertical"
            >

              <TextField
                id="description"
                name="description"
                value={item.description}
                label={t('itemDescription')}
                placeholder={t('itemDescriptionPlaceholder')}
                autoFocus
                margin="dense"
                type="text"
                fullWidth
                required
                onChange={this.handleChangeDescription}
              />

              <FormsyImageUploader
                name="image"
                previewImage={item.image}
                setImage={this.handleChangeImage}
                resize={false}
              />
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleAttach} color="primary" disabled={!formIsValid}>
              Attach
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}


AddItemDialog.propTypes = {
  onAddItem: PropTypes.func.isRequired
};

AddItemDialog.defaultProps = {
};

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
});

export default withStyles(styles)(
  withTranslation()(AddItemDialog)
);