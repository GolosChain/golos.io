import React, { Component } from 'react';

import { fetchPagePost } from 'store/actions/complex/content';
import { fetchProfile } from 'store/actions/gate/user';
import PostContainer from 'containers/post';

export default class Post extends Component {
  static async getInitialProps(ctx) {
    const { store, query } = ctx;

    const contentId = {
      userId: query.userId,
      refBlockNum: Number(query.refBlockNum),
      permlink: query.permlink,
    };

    await store.dispatch(fetchPagePost(contentId));
    await store.dispatch(fetchProfile(query.userId)).catch(() => {
      // TODO: Temporary catch!
      // eslint-disable-next-line no-console
      console.error(`Profile [${query.userId}] not found`);
    });

    return {
      contentId,
      isEdit: query.mode === 'edit',
    };
  }

  render() {
    const { contentId, isEdit } = this.props;

    return <PostContainer contentId={contentId} isEdit={isEdit} />;
  }
}
