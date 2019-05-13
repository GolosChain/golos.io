import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import LoadingIndicator from 'components/elements/LoadingIndicator';
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

// const ShowMore = styled.button`
//   width: 100%;
//   height: 50px;
//   padding: 17px 0;
//
//   border-radius: 0 0 8px 8px;
//   box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.15);
//   background-color: #fff;
//   font-weight: bold;
//
//   color: #111;
//   text-align: center;
//   font-size: 14px;
//   cursor: pointer;
//
//   &:hover {
//     color: #2879ff;
//   }
// `;

// const StyledLoaderWrapper = styled(LoaderWrapper)`
//   @media (max-width: 768px) {
//     align-items: ${({ cutContent }) => (cutContent ? 'flex-start' : 'center')};
//   }
// `;

export default class FollowersDialog extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    profile: PropTypes.shape({}).isRequired,
  };

  showMore = () => {
    // TODO: Not implemented
  };

  renderUser({ userId, name, avatarUrl }) {
    return (
      <UserItem key={userId}>
        <UserLink userId={userId} title={userId} onClick={this.props.onClose}>
          <Avatar avatarUrl={avatarUrl} />
          <Name>{name}</Name>
        </UserLink>
        <Follow following={userId} collapseOnMobile />
      </UserItem>
    );
  }

  render() {
    const { type, profile } = this.props;

    const userIds = profile.subscriptions.userIds;

    return (
      <Dialog>
        <Header>
          <Title>{tt(`user_profile.${type}_count`, { count: userIds.length })}</Title>
          <IconClose onClick={this.props.onClose} />
        </Header>
        <Content>
          {userIds.map(this.renderUser)}
          {/*{loading && (*/}
          {/*  <StyledLoaderWrapper cutContent={hasMore}>*/}
          {/*    <LoadingIndicator type="circle" size={40} />*/}
          {/*  </StyledLoaderWrapper>*/}
          {/*)}*/}
        </Content>
        {/*{hasMore && !loading ? (*/}
        {/*  <ShowMore onClick={this.showMore}>{tt('dialog.show_more')}</ShowMore>*/}
        {/*) : null}*/}
      </Dialog>
    );
  }
}
