import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { File } from 'formsy-react-components';
import Cropper from 'react-cropper';
import ImageTools from '../lib/ImageResizer';
import { withTranslation } from 'react-i18next';

/* global FileReader */
/**
 * Image uploader with preview. Returns base64 image
 *
 *  @param setImage Callback function that is called every time the image changes
 */
class FormsyImageUploader extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      image:  this.props.previewImage || this.props.avatar,
    };
    this.cropImage = this.cropImage.bind(this);
    this.loadAndPreviewImage = this.loadAndPreviewImage.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.avatar != prevProps.avatar) {
      this.setState({ image: this.props.avatar });
    }
    if (this.props.previewImage != prevProps.previewImage) {
      this.setState({ image: this.props.previewImage });
    }
  }

  cropImage() {
    if (!this.cropper) {
      return;
    }
    const imgResized = this.cropper.getCroppedCanvas().toDataURL();
    ImageTools.resize(
      imgResized,
      {
        width: 1000,
        height: 1000,
      },
      (blob, didItResize) => {
        this.props.setImage(didItResize ? blob : imgResized);
      },
    );
  }

  loadAndPreviewImage(name, files) {
    const reader = new FileReader();
    reader.onload = e => {
      this.setState({ image: e.target.result });
      this.props.setImage(e.target.result);
    };
    ImageTools.resize(
      files[0],
      {
        width: 1000,
        height: 1000,
      },
      (blob, didItResize) => {
        reader.readAsDataURL(didItResize ? blob : files[0]);
      },
    );
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        {(this.props.previewImage || this.previewImage) && this.props.resize && (
          <div>
            <div style={{ width: '100%' }}>
              <Cropper
                style={{ maxHeight: 300 }}
                guides={false}
                aspectRatio={this.props.aspectRatio}
                src={this.state.image}
                ref={cropper => {
                  this.cropper = cropper;
                }}
                cropend={this.cropImage}
                modal={false}
                highlight={false}
                autoCropArea={1}
                zoomOnWheel={false}
                viewMode={1}
              />
            </div>
          </div>
        )}
        {this.props.avatar && this.props.resize && (
          <div>
            <div style={{ width: '100%' }}>
              <Cropper
                style={{ maxHeight: 300 }}
                guides={false}
                aspectRatio={this.props.aspectRatio}
                src={this.state.image}
                ref={cropper => {
                  this.cropper = cropper;
                }}
                cropend={this.cropImage}
                modal={false}
                highlight={false}
                autoCropArea={1}
                zoomOnWheel={false}
              />
            </div>
          </div>
        )}
        {!this.props.resize && (this.props.previewImage || this.previewImage) && (
          <div className="image-preview">
            <img src={this.state.image} alt="Preview of uploaded file" />
          </div>
        )}

        <File
          name="picture"
          label={t('imageAdd')}
          accept=".png,.jpeg,.jpg"
          changeCallback={this.loadAndPreviewImage}
          help={t('imageAddHelp')}
          validations="minLength: 1"
          validationErrors={{
            minLength: t('imageMinLength'),
          }}
          required={this.props.isRequired}
        />
      </div>
    );
  }
}

FormsyImageUploader.propTypes = {
  isRequired: PropTypes.bool,
  avatar: PropTypes.string,
  setImage: PropTypes.func.isRequired,
  previewImage: PropTypes.string,
  aspectRatio: PropTypes.number,
  resize: PropTypes.bool,
};

FormsyImageUploader.defaultProps = {
  isRequired: false,
  avatar: undefined,
  previewImage: undefined,
  aspectRatio: 16 / 9,
  resize: true,
};

export default withTranslation()(FormsyImageUploader);