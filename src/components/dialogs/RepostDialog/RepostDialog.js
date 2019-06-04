import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { displayError, displaySuccess } from 'utils/toastMessages';
import Icon from 'components/golos-ui/Icon';
import { safePaste } from 'helpers/browser';
import { breakWordStyles } from 'helpers/styles';
import { PostTitle } from 'components/cards/common';
import CardAuthor from 'components/cards/CardAuthor';
import DialogButton from 'components/common/DialogButton';

const MAX_CHARS = 600;
const PADDING = 24;

const Root = styled.div`
  position: relative;
  flex-basis: 800px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const CloseIcon = styled(Icon)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 30px;
  height: 30px;
  padding: 8px;
  color: #e1e1e1;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #999;
  }
`;

const Header = styled.div`
  padding: 0 ${PADDING}px;
  margin: 18px 0;
  font-size: 20px;
  font-weight: 600;
  user-select: none;
`;

const InputWrapper = styled.div`
  position: relative;
  margin: 0 ${PADDING}px;
`;

const Input = styled.div`
  position: relative;
  display: block;
  width: 100%;
  min-height: 46px;
  max-height: 200px;
  line-height: 24px;
  padding: 11px 16px 9px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
  overflow-y: auto;
  background: transparent;
  ${breakWordStyles};

  &:focus {
    outline: none;
    box-shadow: 0 0 6px #4d90fe;
  }
`;

const Placeholder = styled.div`
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  padding: 11px 0 0 16px;
  line-height: 24px;
  color: #bababa;
  user-select: none;
  pointer-events: none;
`;

const PostPreview = styled.div`
  padding: 0 ${PADDING}px;
  margin: 20px 0 18px;
`;

const CardAuthorStyled = styled(CardAuthor)`
  margin-bottom: 12px;
`;

const Footer = styled.div`
  display: flex;
  height: 50px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 -2px 14px 0 rgba(0, 0, 0, 0.07);
  overflow: hidden;
`;

const ErrorBlock = styled.div`
  margin-top: 8px;
  font-size: 15px;
  color: #fd1b1b;
`;

export default class RepostDialog extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
  };

  inputRef = createRef();

  state = {
    text: '',
    error: null,
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  confirmClose = () => !this.state.text.trim();

  onTextChange = () => {
    const text = this.inputRef.current.innerText;
    let error = null;

    if (text.length > MAX_CHARS) {
      error = tt('dialogs_repost.too_long', { count: MAX_CHARS });
    }

    this.setState({
      text,
      error,
    });
  };

  onCancelClick = () => {
    const { close } = this.props;
    close();
  };

  onOkClick = async () => {
    const { contentId, reblog, close } = this.props;
    const { text } = this.state;

    try {
      await reblog({
        contentId,
        text: text.trim(),
      });

      close();
      displaySuccess('Reblogged successfully');
    } catch (err) {
      displayError(err);
    }
  };

  render() {
    const { post } = this.props;
    const { text, error } = this.state;

    return (
      <Root>
        <CloseIcon name="cross_thin" onClick={this.onClose} />
        <Header>{tt('dialogs_repost.title')}</Header>
        <InputWrapper>
          {text && text !== '\n' ? null : (
            <Placeholder>{tt('dialogs_repost.placeholder')}</Placeholder>
          )}
          <Input
            tabIndex="0"
            contentEditable="true"
            role="textbox"
            aria-multiline="true"
            autoComplete="off"
            value={text}
            autoFocus
            ref={this.inputRef}
            onInput={this.onTextChange}
            onPaste={safePaste}
          />
          {error ? <ErrorBlock>{error}</ErrorBlock> : null}
        </InputWrapper>
        <PostPreview>
          <CardAuthorStyled noLinks authorId={post.author} created={post.meta.time} />
          <PostTitle>{post.content.title}</PostTitle>
        </PostPreview>
        <Footer>
          <DialogButton text={tt('g.cancel')} onClick={this.onCancelClick} />
          <DialogButton
            text={tt('dialogs_repost.ok')}
            primary
            disabled={Boolean(error)}
            onClick={this.onOkClick}
          />
        </Footer>
      </Root>
    );
  }
}
