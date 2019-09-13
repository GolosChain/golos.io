import React, { Component } from 'react';

import { fetchPagePost } from 'store/actions/complex/content';
import { fetchProfile } from 'store/actions/gate/user';
import PostContainer from 'containers/post';

export default class Post extends Component {
  static async getInitialProps(ctx) {
    const { store, query } = ctx;

    const post = await store.dispatch(
      fetchPagePost({
        userId: query.userId,
        username: query.username,
        permlink: query.permlink,
      })
    );

    if (!post) {
      return {
        contentId: {
          userId: '',
          permlink: query.permlink,
        },
        isEdit: false,
      };
    }

    try {
      await store.dispatch(fetchProfile({ userId: post.contentId.userId }));
    } catch (err) {
      if (err.message !== 'GateError content.getProfile: Not found') {
        console.error(`fetchProfile (in post) failed for '${post.contentId.userId}':`, err);
      }
    }

    return {
      contentId: post.contentId,
      isEdit: query.mode === 'edit',
    };
  }

  render() {
    const { contentId, isEdit } = this.props;

    return <PostContainer contentId={contentId} isEdit={isEdit} />;
  }
}
