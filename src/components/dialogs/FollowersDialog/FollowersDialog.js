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
    type: PropTypes.oneOf(['followers', 'followings']).isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string,
      })
    ),
    isEnd: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    profile: PropTypes.shape({}).isRequired,
    getSubscriptions: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.load({
      closeOnError: true,
    });
  }

  async load({ sequenceKey = null, closeOnError }) {
    const { userId, type, getSubscriptions, getSubscribers, onClose } = this.props;

    try {
      if (type === 'followers') {
        await getSubscribers({ userId, sequenceKey });
      } else {
        await getSubscriptions({ userId, sequenceKey });
      }
    } catch (err) {
      displayError(err);

      if (closeOnError) {
        onClose();
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

  renderUser = ({ userId, username, avatarUrl, hasSubscription }) => (
    <UserItem key={userId}>
      <UserLink userId={userId} title={userId} onClick={this.props.onClose}>
        <Avatar avatarUrl={avatarUrl} />
        <Name>{username || userId}</Name>
      </UserLink>
      <Follow following={userId} isFollow={hasSubscription} collapseOnMobile />
    </UserItem>
  );

  render() {
    const { type, profile, items, isLoading, isEnd } = this.props;
    const { usersCount } = profile.subscriptions;

    return (
      <DialogStyled>
        <Header>
          <Title>{tt(`user_profile.${type}_count`, { count: usersCount })}</Title>
          <IconClose onClick={this.props.onClose} />
        </Header>
        <Content>
          <InfinityScrollHelper disabled={isLoading || isEnd} onNeedLoadMore={this.onNeedLoadMore}>
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
