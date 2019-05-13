import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import keyCodes from 'utils/keyCodes';
import DialogFrame from 'components/dialogs/DialogFrame';
import Input from 'components/elements/common/Input';

export default class LinkOptionsDialog extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  linkRef = createRef();
  textRef = createRef();

  state = {
    link: this.props.link,
    text: this.props.text,
  };

  render() {
    const { text, link } = this.state;

    return (
      <DialogFrame
        className="LinkOptionsDialog"
        title={tt('post_editor.add_image')}
        buttons={[
          {
            text: tt('g.cancel'),
            onClick: this._onCloseClick,
          },
          {
            text: tt('g.ok'),
            primary: true,
            onClick: this._onOkClick,
          },
        ]}
        onCloseClick={this._onCloseClick}
      >
        <div className="LinkOptionsDialog__body">
          <label className="LinkOptionsDialog__label">
            {tt('editor_toolbar.link_text')}:
            <Input
              ref={this.textRef}
              block
              value={text}
              autoFocus={!text}
              onKeyDown={this._onKeyDown}
              onChange={this._onTextChange}
            />
          </label>
          <label className="LinkOptionsDialog__label">
            {tt('editor_toolbar.link_value')}:
            <Input
              ref={this.linkRef}
              block
              value={link}
              autoFocus={text && !link}
              onKeyDown={this._onKeyDown}
              onChange={this._onLinkChange}
            />
          </label>
        </div>
      </DialogFrame>
    );
  }

  _onCloseClick = () => {
    this.props.onClose();
  };

  _onOkClick = () => {
    const { link, text } = this.state;

    if (!text) {
      this.textRef.current.focus();
    } else if (!link) {
      this.linkRef.current.focus();
    } else {
      this.props.onClose({
        text: text,
        link: link,
      });
    }
  };

  _onTextChange = e => {
    this.setState({
      text: e.target.value,
    });
  };

  _onLinkChange = e => {
    this.setState({
      link: e.target.value,
    });
  };

  _onKeyDown = e => {
    if (e.which === keyCodes.ENTER) {
      e.preventDefault();
      this._onOkClick();
    }
  };
}
