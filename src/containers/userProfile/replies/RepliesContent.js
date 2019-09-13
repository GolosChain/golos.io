/* eslint-disable no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Head from 'next/head';
import tt from 'counterpart';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import InfoBlock from 'components/common/InfoBlock';
import BlogCardsList from 'components/common/CardsList';
import EmptyBlock, { EmptySubText } from 'components/common/EmptyBlock';
import CommentCard from 'components/cards/CommentCard';
import CardsListWrapper from 'components/common/CardsListWrapper';
import { visuallyHidden } from 'helpers/styles';
import { fetchReplies } from 'store/actions/gate';

const Loader = styled(LoadingIndicator)`
  margin-top: 30px;
`;

const Header = styled.h1`
  ${visuallyHidden};
`;

export default class RepliesContent extends Component {
  static async getInitialProps({ store, parentProps }) {
    const { userId } = parentProps;

    try {
      await store.dispatch(
        fetchReplies({
          userId,
        })
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  static propTypes = {
    userId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool,
    replies: PropTypes.arrayOf(PropTypes.string),
    fetchError: PropTypes.bool,
    sequenceKey: PropTypes.string,
    isLoading: PropTypes.bool,
    isEnd: PropTypes.bool,

    fetchReplies: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isOwner: false,
    isLoading: false,
    fetchError: false,
    isEnd: false,
    replies: [],
    sequenceKey: '',
  };

  itemRender = props => <CommentCard {...props} showSpam entityName="replies" />;

  fetchMore = () => {
    const { isLoading, isEnd, userId, sequenceKey, fetchReplies } = this.props;

    if (!isLoading && !isEnd) {
      fetchReplies({
        userId,
        sequenceKey,
      });
    }
  };

  renderCardsList() {
    const { userId, isOwner, replies, isLoading } = this.props;

    if (!replies || isLoading) {
      return <Loader type="circle" center size={40} />;
    }

    if (!replies.length) {
      return (
        <InfoBlock>
          <EmptyBlock>
            {tt('g.empty')}
            <EmptySubText>
              {isOwner
                ? tt('content.tip.replies.start_writing')
                : tt('content.tip.replies.user_has_no_replies')}
            </EmptySubText>
          </EmptyBlock>
        </InfoBlock>
      );
    }

    return (
      <BlogCardsList
        userId={userId}
        itemRender={this.itemRender}
        disallowGrid
        category="recent_replies"
        allowInlineReply={!isOwner}
        order="by_replies"
        items={replies}
        loadMore={this.fetchMore}
      />
    );
  }

  render() {
    const { userId, profile } = this.props;

    return (
      <>
        <Head>
          <title>
            {tt('meta.title.profile.replies', { name: profile.username || profile.userId })}
          </title>
        </Head>
        <Header>{tt('g.replies')}</Header>
        <CardsListWrapper>{this.renderCardsList()}</CardsListWrapper>
      </>
    );
  }
}
