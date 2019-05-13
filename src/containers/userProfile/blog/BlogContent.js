import React, { Component } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import tt from 'counterpart';

import { Link } from 'shared/routes';
import { fetchPosts } from 'store/actions/gate';
import { visuallyHidden } from 'helpers/styles';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import CardsList from 'components/common/CardsList';
import InfoBlock from 'components/common/InfoBlock';
import EmptyBlock, { EmptySubText } from 'components/common/EmptyBlock';
import CardsListWrapper from 'components/common/CardsListWrapper';

const Loader = styled(LoadingIndicator)`
  margin-top: 30px;
`;

const Header = styled.h1`
  ${visuallyHidden};
`;

export default class BlogContent extends Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(
      fetchPosts({
        type: 'user',
        id: query.userId,
      })
    );
  }

  fetchPosts = () => {
    const { isFetching, isEnd, userId, sequenceKey, fetchComments } = this.props;

    if (!isFetching && !isEnd) {
      fetchPosts({
        type: 'user',
        id: userId,
        sequenceKey,
      });
    }
  };

  render() {
    const { profile, layout } = this.props;

    return (
      <>
        <Head>
          <title>{tt('meta.title.profile.blog', { name: profile.username })}</title>
        </Head>
        <Header>{tt('g.blog')}</Header>
        <CardsListWrapper noGaps={layout === 'compact'}>{this._render()}</CardsListWrapper>
      </>
    );
  }

  _render() {
    const { profile, posts } = this.props;

    if (!posts) {
      return <Loader type="circle" center size={40} />;
    }

    if (!posts.length) {
      return this._renderCallOut();
    }

    return (
      <CardsList
        userId={profile.id}
        category="blog"
        showPinButton
        items={posts}
        loadMore={this.fetchPosts}
        // showSpam TODO
      />
    );
  }

  _renderCallOut() {
    const { isOwner } = this.props;

    return (
      <InfoBlock>
        <EmptyBlock>
          {tt('g.empty')}
          <EmptySubText>
            {isOwner ? (
              <>
                {tt('content.tip.blog.start_writing')}{' '}
                <Link route="submit">
                  <a>{`#${tt('content.tip.blog.tag_1')}`}</a>
                </Link>{' '}
                <Link route="submit">
                  <a>{`#${tt('content.tip.blog.tag_2')}`}</a>
                </Link>
                {tt('content.tip.blog.start_writing_2')}
              </>
            ) : (
              tt('content.tip.blog.user_has_no_post')
            )}
          </EmptySubText>
        </EmptyBlock>
      </InfoBlock>
    );
  }
}
