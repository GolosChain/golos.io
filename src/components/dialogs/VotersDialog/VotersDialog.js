import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { getVoters } from 'utils/votes';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import Avatar from 'components/common/Avatar';
import Follow from 'components/common/Follow';
import {
  Dialog,
  Header,
  Title,
  IconClose,
  Content,
  UserItem,
  UserLink,
  Name,
  LoaderWrapper,
} from 'components/dialogs/common/Dialog';

const EmptyBlockLikeFollow = styled.div`
  min-width: 165px;

  @media (max-width: 500px) {
    min-width: 34px;
    max-width: 34px;
  }
`;

const Percent = styled.p`
  margin: 0;
  padding: 0;
  min-width: 37px;
  width: 37px;
  max-width: 37px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.29;
  letter-spacing: 0.4px;
  color: #393636;
  text-align: center;
`;

export default class VotersDialog extends PureComponent {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({})),
    data: PropTypes.shape({}).isRequired,
    currentUserId: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLikes: PropTypes.bool.isRequired,
    isEnd: PropTypes.bool.isRequired,
    sequenceKey: PropTypes.string,

    fetchPostVotes: PropTypes.func.isRequired,
    fetchCommentVotes: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    users: [],
    sequenceKey: null,
  };

  loadMore = async () => {
    const { data, sequenceKey, fetchPostVotes, fetchCommentVotes } = this.props;
    await getVoters(data, sequenceKey, fetchPostVotes, fetchCommentVotes);
  };

  onNeedLoadMore = () => {
    const { isEnd, isLoading } = this.props;

    if (isEnd || isLoading) {
      return;
    }

    this.loadMore();
  };

  renderUsers = () => {
    const { users, currentUserId, onClose } = this.props;
    return users.map(({ name, userId, avatar, percent }) => (
      <UserItem key={name}>
        <UserLink userId={userId} title={name} onClick={onClose}>
          <Avatar avatarUrl={avatar} />
          <Name>{name}</Name>
        </UserLink>
        <Percent>{Math.round(percent)}%</Percent>
        {userId !== currentUserId ? (
          <Follow userId={userId} collapseOnMobile />
        ) : (
          <EmptyBlockLikeFollow />
        )}
      </UserItem>
    ));
  };

  render() {
    const { isLoading, isLikes, isEnd, onClose } = this.props;
    return (
      <Dialog>
        <Header>
          <Title>{tt(`dialog.${isLikes ? 'liked' : 'disliked'}`)}</Title>
          <IconClose onClick={onClose} />
        </Header>
        <Content>
          <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.onNeedLoadMore}>
            {this.renderUsers()}
          </InfinityScrollHelper>
          {isLoading && (
            <LoaderWrapper>
              <LoadingIndicator type="circle" size={40} />
            </LoaderWrapper>
          )}
        </Content>
      </Dialog>
    );
  }
}
