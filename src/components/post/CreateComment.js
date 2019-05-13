import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import is from 'styled-is';

import CommentFormLoader from 'components/modules/CommentForm/loader';

import { smoothScroll } from 'helpers/window';

const shadowScale = keyframes`
  0% {
    box-shadow: 0 0 10px 0 rgba(200, 225, 255, 0.06);
    border-color: rgba(33, 136, 255, 0.06);
  }
  50% {
    box-shadow: 0 0 10px 0 rgba(200, 225, 255, 1);
    border-color: rgba(33, 136, 255, 1);
  }
  100% {
    box-shadow: 0 0 10px 0 rgba(200, 225, 255, 0.06);
    border-color: rgba(33, 136, 255, 0.06);
  }
`;

const Wrapper = styled.div`
  margin-top: 20px;
  padding: 27px 20px 0;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  ${is('addGap')`
    padding-bottom: 17px;
  `};

  ${is('commentInputFocused')`
    animation: ${shadowScale} 1.5s linear 0.8s;
  `};
`;

export default class CreateComment extends Component {
  static propTypes = {
    data: PropTypes.shape({}).isRequired,
    commentInputFocused: PropTypes.bool,
    commentContainerRef: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.element]),
  };

  static defaultProps = {
    commentInputFocused: false,
    commentContainerRef: null,
  };

  state = {
    inputText: '',
  };

  textChange = value => {
    this.setState({
      inputText: value.trim(),
    });
  };

  onSuccess = () => {
    const { commentContainerRef } = this.props;

    if (commentContainerRef && commentContainerRef.current) {
      const commentContainerBottom = commentContainerRef.current.getBoundingClientRect().bottom;
      smoothScroll(commentContainerBottom + window.pageYOffset, 1000);
    }
  };

  onCancel = () => {};

  render() {
    const { data, commentInputFocused } = this.props;
    const { inputText } = this.state;

    return (
      <Wrapper
        id="createComment"
        addGap={inputText.length === 0}
        commentInputFocused={commentInputFocused}
      >
        <CommentFormLoader
          hideFooter={inputText.length === 0}
          params={data}
          clearAfterAction
          onChange={this.textChange}
          onSuccess={this.onSuccess}
          onCancel={this.onCancel}
        />
      </Wrapper>
    );
  }
}
