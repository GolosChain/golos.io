import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Link } from 'shared/routes';
import { formatContentId } from 'store/schemas/gate';

const PostTitleLink = styled(Link)`
  display: block;
  color: #333;
  white-space: nowrap;
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default class PostLink extends Component {
  static propTypes = {
    post: PropTypes.shape({}),
    contentId: PropTypes.shape({}).isRequired,
    fetchPostIfNeeded: PropTypes.func.isRequired,
  };

  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
    this.fetchContent();
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  async fetchContent() {
    const { post, fetchPostIfNeeded, contentId } = this.props;

    if (!post) {
      if (contentId) {
        try {
          await fetchPostIfNeeded(contentId);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(`Unable to load post:`, contentId);
        }
      }
    }
  }

  render() {
    const { post, contentId } = this.props;
    return post ? (
      <PostTitleLink to={`/@${formatContentId(post.contentId)}`}>
        {post.content.title}
      </PostTitleLink>
    ) : (
      <div>
        Награда за <Link to={`@${formatContentId(contentId)}`}>публикацию</Link>
      </div>
    );
  }
}
