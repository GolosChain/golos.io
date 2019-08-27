import React from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import ReactDropZone from 'react-dropzone';

import { ALLOWED_IMAGE_TYPES } from 'constants/config';
import { validateImageFile } from 'utils/uploadImages';
import keyCodes from 'utils/keyCodes';

import Icon from 'components/golos-ui/Icon';
import DialogFrame from 'components/dialogs/DialogFrame';
import Input from 'components/elements/common/Input';

export default class AddImageDialog extends React.PureComponent {
  static propTypes = {
    close: PropTypes.func.isRequired,
  };

  onInputKeyDown = e => {
    const { close } = this.props;

    if (e.which === keyCodes.ENTER) {
      e.preventDefault();
      close({
        url: e.target.value,
      });
    }
  };

  onCloseClick = () => {
    const { close } = this.props;
    close();
  };

  onDrop = files => {
    const { close } = this.props;
    const file = files[0];

    if (validateImageFile(file)) {
      close({ file });
    }
  };

  render() {
    return (
      <DialogFrame
        className="AddImageDialog"
        title={tt('post_editor.add_image')}
        onCloseClick={this.onCloseClick}
      >
        <div className="AddImageDialog__body">
          <ReactDropZone accept={ALLOWED_IMAGE_TYPES} multiple={false} onDrop={this.onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div className="AddImageDialog__drop-zone" {...getRootProps()}>
                <input {...getInputProps()} />
                <Icon className="AddImageDialog__drop-zone-icon" name="editor-toolbar-picture" />
                <span className="AddImageDialog__drop-zone-text">
                  {tt('editor_toolbar.add_image_from_computer')}
                </span>
              </div>
            )}
          </ReactDropZone>
          <div className="AddImageDialog__splitter" />
          <div>
            <div className="AddImageDialog__link-text">
              {tt('editor_toolbar.add_image_via_link')}:
            </div>
            <Input
              block
              className="AddImageDialog__link-input"
              placeholder="https://"
              onKeyDown={this.onInputKeyDown}
            />
          </div>
        </div>
      </DialogFrame>
    );
  }
}
