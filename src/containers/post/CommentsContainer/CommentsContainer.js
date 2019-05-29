import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CommentsHeader from 'components/post/CommentsHeader/CommentsHeader.connect';
import CreateComment from 'components/post/CreateComment';
import CommentsList from 'components/post/CommentsList';
import LoadingIndicator from 'components/elements/LoadingIndicator';

const Wrapper = styled.div`
  padding-top: 20px;

  @media (max-width: 576px) {
    margin: 0 20px;
  }
`;

const Loader = styled(LoadingIndicator).attrs({ type: 'circle', center: true, size: 50 })`
  margin-top: 20px;
`;

export default class CommentsContainer extends Component {
  static propTypes = {
    post: PropTypes.shape().isRequired,
    sequenceKey: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isAutoLogging: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool,
    isEnd: PropTypes.bool,
    commentInputFocused: PropTypes.bool,
    isAuthorized: PropTypes.bool,

    fetchPostComments: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isLoading: false,
    isEnd: false,
    commentInputFocused: false,
    isAuthorized: false,
    sequenceKey: null,
  };

  commentContainerRef = createRef();

  componentDidMount() {
    const { isAutoLogging } = this.props;

    if (!isAutoLogging) {
      this.fetchComments();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isAutoLogging } = this.props;

    if (isAutoLogging && !nextProps.isAutoLogging) {
      this.fetchComments();
    }
  }

  fetchComments = (params = {}) => {
    const { post, fetchPostComments, sequenceKey } = this.props;

    if (!post) {
      return;
    }

    fetchPostComments({
      contentId: post.contentId,
      sequenceKey,
      ...params,
    });
  };

  render() {
    const {
      post,
      isAutoLogging,
      isLoading,
      isEnd,
      list,
      commentInputFocused,
      isAuthorized,
    } = this.props;

    if (!post) {
      return null;
    }

    return (
      <Wrapper ref={this.commentContainerRef}>
        <CommentsHeader
          commentsCount={post.stats.commentsCount}
          fetchComments={this.fetchComments}
        />
        {isAuthorized ? (
          <CreateComment
            data={post}
            parentPost={post.contentId}
            commentInputFocused={commentInputFocused}
            commentContainerRef={this.commentContainerRef}
          />
        ) : null}
        {list.length ? (
          <CommentsList
            postContentId={[post.contentId]}
            list={list}
            allowFetch={!isEnd && !isLoading}
            fetchComments={this.fetchComments}
          />
        ) : null}
        {isAutoLogging || isLoading ? <Loader /> : null}
      </Wrapper>
    );
  }
}
