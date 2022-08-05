import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormsy } from 'formsy-react';
import ReactQuill from 'react-quill';
//import ipfsService from 'ipfs/IpfsService';
import config from '../configuration';

import VideoPopup from './VideoPopup';

class QuillFormsy extends Component {
  constructor(props) {
    super(props);
    this.reactQuillRef = null; // ReactQuill component
    this.imageUploader = null; // Hidden Input component
    this.imageHandler = this.imageHandler.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  componentDidMount() {
    const toolbar = this.reactQuillRef.getEditor().getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
    toolbar.addHandler('video', () => {
      const quill = this.reactQuillRef.getEditor();
      const index = quill.getLength() - 1;
      VideoPopup(url => {
        quill.insertEmbed(index, 'video', url);
        React.swal.close();
      });
    });
  }

  imageHandler() {
    this.imageUploader.click();
  }

  handleImageUpload() {
    const file = this.imageUploader.files[0];

    /*ipfsService.upload(file).then(hash => {
      console.log('file', config.ipfsGateway + hash.slice(6));
      this.insertToEditor(config.ipfsGateway + hash.slice(6));
    });*/
  }

  insertToEditor(file) {
    const quill = this.reactQuillRef.getEditor();
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', file);
  }

  render() {
    const {
      label,
      helpText,
      value,
      placeholder,
      setValue,
      isRequired,
      isPristine,
      isValid,
      errorMessage,
    } = this.props;

    // Set a specific className based on the validation
    // state of this component. showRequired() is true
    // when the value is empty and the required prop is
    // passed to the input. showError() is true when the
    // value typed is invalid
    let errorClass = '';
    if (!isPristine) {
      if (isValid) errorClass = 'is-valid';
      else errorClass = 'has-error';
    }

    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    //const errorMessage = errorMessage;

    const modules = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    };

    const formats = [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'indent',
      'link',
      'image',
      'video',
    ];

    return (
      <div className={`form-group ${errorClass}`}>
        <input
          style={{ display: 'none' }}
          type="file"
          onChange={this.handleImageUpload}
          ref={e => {
            this.imageUploader = e;
          }}
        />
        <div className="label">
          {label} {isRequired ? '*' : null}
        </div>
        <small className="form-text">{helpText}</small>
        <ReactQuill
          height="200px"
          ref={el => {
            this.reactQuillRef = el;
          }}
          modules={modules}
          formats={formats}
          value={value}
          name="description"
          placeholder={placeholder}
          onChange={setValue}
          id="quill-formsy"
          theme="snow"
        />
        <span className="help-block validation-message">{errorMessage}</span>
      </div>
    );
  }
}

QuillFormsy.propTypes = {
  // Formsy proptypes
  //value: PropTypes.func.isRequired,
  //setValue: PropTypes.func.isRequired,
  //isRequired: PropTypes.func.isRequired,
  //isPristine: PropTypes.func.isRequired,
  //isValid: PropTypes.func.isRequired,
  //getErrorMessage: PropTypes.func.isRequired,

  helpText: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
};

QuillFormsy.defaultProps = {
  helpText: '',
  placeholder: '',
  label: '',
};

export default withFormsy(QuillFormsy);
