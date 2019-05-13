import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import CommentCard from 'components/cards/CommentCard';
import CloseOpenButton from 'components/cards/CloseOpenButton';

const Wrapper = styled.div`
  position: relative;
  margin-top: 10px;

  ${is('isShifted')`
    margin-left: 20px;

    @media (max-width: 500px) {
      margin-left: 10px;
    }
  `};

  ${is('isTop')`
    margin-top: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    background-color: #fff;
  `};
`;

const Comment = styled(CommentCard)`
  margin-bottom: 0;

  @media (max-width: 500px) {
    margin-bottom: 10px;
    border-bottom: 1px solid #e9e9e9;

    &:last-of-type {
      margin-bottom: 0;
      border-bottom: none;
    }
  }
`;

const ToggleButton = styled(CloseOpenButton)`
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;

  width: 30px;
  height: 30px;

  ${is('collapsed')`
    top: 14px;
  `};
`;

export default class NestedComment extends Component {
  static propTypes = {
    commentNode: PropTypes.object.isRequired,
  };

  nestedCommentRef = createRef();

  state = {
    collapsed: false,
  };

  onEntryClick = () => {
    // this.props.saveListScrollPosition(getScrollElement().scrollTop);
  };

  toggleComment = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });

    this.nestedCommentRef.current.toggleComment();
  };

  renderReplies(comments) {
    if (comments.length === 0) {
      return null;
    }

    return comments.map(commentNode => (
      <NestedComment key={commentNode.commentId} commentNode={commentNode} />
    ));
  }

  render() {
    const { commentNode } = this.props;
    const { collapsed } = this.state;

    const isTop = commentNode.level === 1;

    return (
      <Wrapper isTop={isTop} isShifted={commentNode.level > 1}>
        {isTop ? <ToggleButton collapsed={collapsed} onClick={this.toggleComment} /> : null}
        <Comment
          ref={this.nestedCommentRef}
          id={commentNode.commentId}
          isPostPage
          level={commentNode.level - 1}
          childrenCount={commentNode?.children?.length || 0}
          onClick={this.onEntryClick}
        />
        {collapsed ? null : this.renderReplies(commentNode.children)}
      </Wrapper>
    );
  }
}
