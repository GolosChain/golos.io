import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import Interpolate from 'react-interpolate-component';

import { Link } from 'shared/routes';
import { formatContentId } from 'store/schemas/gate';

const ContentTitleLink = styled.a`
  display: inline;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: underline;
`;

export default class RewardContentLink extends Component {
  static propTypes = {
    contentMeta: PropTypes.shape({}),
    contentId: PropTypes.shape({}).isRequired,
    getNotifyMeta: PropTypes.func.isRequired,
  };

  static defaultProps = {
    contentMeta: null,
  };

  componentDidMount() {
    this.fetchContent();
  }

  async fetchContent() {
    const { contentId, contentMeta, getNotifyMeta } = this.props;

    if (!contentMeta && contentId) {
      try {
        await getNotifyMeta({ contentId, userId: contentId.userId });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`Unable to load content:`, contentId);
      }
    }
  }

  static renderLink(url, text) {
    return (
      <Link to={url} passHref>
        <ContentTitleLink>{text}</ContentTitleLink>
      </Link>
    );
  }

  renderPostLink() {
    const {
      contentMeta: { post, user },
    } = this.props;

    const href = `/@${formatContentId({
      userId: user.username || post.contentId.userId,
      permlink: post.contentId.permlink,
    })}`;

    if (post.title) {
      return (
        <Interpolate with={{ text: RewardContentLink.renderLink(href, post.title) }}>
          {tt('user_wallet.content.reward_post_with_text', {
            interpolate: false,
          })}
        </Interpolate>
      );
    }

    return (
      <div>
        {tt('user_wallet.content.reward_for')}{' '}
        {RewardContentLink.renderLink(href, tt('user_wallet.content.post'))}
      </div>
    );
  }

  renderCommentLink() {
    const {
      contentMeta: { comment },
    } = this.props;

    const href = `/@${formatContentId(comment.parentPost.contentId)}#${formatContentId(
      comment.contentId
    )}`;

    if (comment?.body) {
      return (
        <Interpolate with={{ text: RewardContentLink.renderLink(href, comment.body) }}>
          {tt('user_wallet.content.reward_comment_with_text', {
            interpolate: false,
          })}
        </Interpolate>
      );
    }

    return (
      <div>
        {tt('user_wallet.content.reward_for')}{' '}
        {RewardContentLink.renderLink(href, tt('user_wallet.content.comment'))}
      </div>
    );
  }

  render() {
    const { contentId, contentMeta } = this.props;

    if (contentMeta) {
      const { post, comment } = contentMeta;

      if (post) {
        return this.renderPostLink();
      }

      if (comment) {
        return this.renderCommentLink();
      }
    }

    return (
      <div>
        {tt('user_wallet.content.reward_for')}{' '}
        {RewardContentLink.renderLink(
          `@${formatContentId(contentId)}`,
          tt('user_wallet.content.publication')
        )}
      </div>
    );
  }
}
