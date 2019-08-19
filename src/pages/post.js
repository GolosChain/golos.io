import React, { Component } from 'react';

import { fetchPagePost } from 'store/actions/complex/content';
import { fetchProfile } from 'store/actions/gate/user';
import PostContainer from 'containers/post';

export default class Post extends Component {
  static async getInitialProps(ctx) {
    const { store, query } = ctx;

    const post = await store.dispatch(
      fetchPagePost({
        user: query.userId,
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

    await store.dispatch(fetchProfile(post.contentId.userId)).catch(() => {
      // TODO: Temporary catch!
      // eslint-disable-next-line no-console
      console.error(`Profile [${post.contentId.userId}] not found`);
    });

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
