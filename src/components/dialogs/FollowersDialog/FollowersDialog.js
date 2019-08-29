import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { displayError } from 'utils/toastMessages';
import { profileType } from 'types/common';
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

const DialogStyled = styled(Dialog)`
  min-height: 300px;
`;

const LoaderWrapperStyled = styled(LoaderWrapper)`
  @media (max-width: 768px) {
    align-items: ${({ cutContent }) => (cutContent ? 'flex-start' : 'center')};
  }
`;

export default class FollowersDialog extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['followers', 'following']).isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string,
      })
    ),
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    profile: profileType.isRequired,
    getSubscriptions: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.load({
      closeOnError: true,
    });
  }

  async load({ sequenceKey = null, closeOnError }) {
    const { userId, type, getSubscriptions, getSubscribers, close } = this.props;

    try {
      if (type === 'followers') {
        await getSubscribers({ userId, sequenceKey });
      } else {
        await getSubscriptions({ userId, sequenceKey });
      }
    } catch (err) {
      displayError(err);

      if (closeOnError) {
        close();
      }
    }
  }

  onNeedLoadMore = () => {
    const { isEnd, isLoading, sequenceKey } = this.props;

    if (isEnd || isLoading) {
      return;
    }

    this.load({ sequenceKey });
  };

  renderUser = ({ userId, username, avatarUrl, isSubscribed }) => {
    const { close } = this.props;
    const user = username || userId;

    return (
      <UserItem key={userId}>
        <UserLink userId={user} title={user} onClick={close}>
          <Avatar avatarUrl={avatarUrl} />
          <Name>{user}</Name>
        </UserLink>
        <Follow userId={userId} isFollow={isSubscribed} collapseOnMobile />
      </UserItem>
    );
  };

  render() {
    const { type, profile, items, isLoading, isEnd, close } = this.props;
    let totalCount;

    if (type === 'followers') {
      totalCount = profile.subscribers.usersCount;
    } else {
      totalCount = profile.subscriptions.usersCount;
    }

    return (
      <DialogStyled>
        <Header>
          <Title>{tt(`user_profile.${type}_count`, { count: totalCount })}</Title>
          <IconClose onClick={close} />
        </Header>
        <Content>
          <InfinityScrollHelper
            isDialog
            disabled={isLoading || isEnd}
            onNeedLoadMore={this.onNeedLoadMore}
          >
            {items.map(this.renderUser)}
          </InfinityScrollHelper>
          {isLoading && (
            <LoaderWrapperStyled cutContent={!isEnd}>
              <LoadingIndicator type="circle" size={40} />
            </LoaderWrapperStyled>
          )}
        </Content>
      </DialogStyled>
    );
  }
}
