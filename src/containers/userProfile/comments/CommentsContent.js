import React, { Component } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import tt from 'counterpart';

import { fetchUserComments } from 'store/actions/gate/comments';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import CardsList from 'components/common/CardsList';
import InfoBlock from 'components/common/InfoBlock';
import EmptyBlock, { EmptySubText } from 'components/common/EmptyBlock';
import CommentCard from 'components/cards/CommentCard';
import CardsListWrapper from 'components/common/CardsListWrapper';
import { visuallyHidden } from 'helpers/styles';

const Loader = styled(LoadingIndicator)`
  margin-top: 30px;
`;

const Header = styled.h1`
  ${visuallyHidden};
`;

export default class CommentsContent extends Component {
  static async getInitialProps({ store, parentProps }) {
    const { userId } = parentProps;

    try {
      await store.dispatch(
        fetchUserComments({
          userId,
        })
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  fetchComments = () => {
    const { isFetching, isEnd, userId, sequenceKey, fetchUserComments } = this.props;

    if (!isFetching && !isEnd) {
      fetchUserComments({
        userId,
        sequenceKey,
      });
    }
  };

  renderItem({ id, ...props }) {
    return <CommentCard {...props} showSpam entityName="profileComments" id={id} />;
  }

  renderList() {
    const { userId, comments, isLoading, isOwner } = this.props;

    if (isLoading) {
      return <Loader type="circle" center size={40} />;
    }

    if (!comments.length) {
      return (
        <InfoBlock>
          <EmptyBlock>
            {tt('g.empty')}
            <EmptySubText>
              {isOwner
                ? tt('content.tip.comments.start_writing')
                : tt('content.tip.comments.user_has_no_comments')}
            </EmptySubText>
          </EmptyBlock>
        </InfoBlock>
      );
    }

    return (
      <CardsList
        userId={userId}
        items={comments}
        disallowGrid
        allowInlineReply={!isOwner}
        itemRender={this.renderItem}
        loadMore={this.fetchComments}
      />
    );
  }

  render() {
    const { profile } = this.props;

    return (
      <>
        <Head>
          <title>
            {tt('meta.title.profile.comments', { name: profile.username || profile.userId })}
          </title>
        </Head>
        <Header>{tt('g.comments')}</Header>
        <CardsListWrapper>{this.renderList()}</CardsListWrapper>
      </>
    );
  }
}
