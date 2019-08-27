import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { displayError } from 'utils/toastMessages';
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

    getVoters: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  static defaultProps = {
    users: [],
    sequenceKey: null,
  };

  loadMore = async () => {
    const { data, sequenceKey, getVoters } = this.props;
    try {
      await getVoters(data, sequenceKey);
    } catch (err) {
      displayError('Cannot load voters list', err);
    }
  };

  onNeedLoadMore = () => {
    const { isEnd, isLoading } = this.props;

    if (isEnd || isLoading) {
      return;
    }

    this.loadMore();
  };

  renderUsers() {
    const { users, currentUserId, close } = this.props;
    return users.map(({ name, userId, avatar, percent, isSubscribed }) => {
      const user = name || userId;

      return (
        <UserItem key={name}>
          <UserLink userId={user} title={user} onClick={close}>
            <Avatar avatarUrl={avatar} />
            <Name>{user}</Name>
          </UserLink>
          <Percent>{Math.round(percent)}%</Percent>
          {/* TODO: uncomment when hasSubscription flag will be added
        {userId !== currentUserId ? (
          <Follow userId={userId} collapseOnMobile isFollow={hasSubscription} />
        ) : ( */}
          <EmptyBlockLikeFollow />
          {/* )} */}
        </UserItem>
      );
    });
  }

  render() {
    const { isLoading, isLikes, isEnd, close } = this.props;
    return (
      <Dialog>
        <Header>
          <Title>{tt(`dialog.${isLikes ? 'liked' : 'disliked'}`)}</Title>
          <IconClose onClick={close} />
        </Header>
        <Content>
          <InfinityScrollHelper
            isDialog
            disabled={isLoading || isEnd}
            onNeedLoadMore={this.onNeedLoadMore}
          >
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
