/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import Interpolate from 'react-interpolate-component';

import { breakWordStyles } from 'helpers/styles';
import { getPropsForInterpolation } from 'helpers/notifications';
import Icon from 'components/golos-ui/Icon';

import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import Link from 'components/common/Link';
import Avatar from 'components/common/Avatar';
import Follow from 'components/common/Follow';

const Wrapper = styled.div`
  padding: 10px 15px;

  &:first-child {
    padding-top: 15px;
  }

  &:last-child {
    padding-bottom: 15px;
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
`;

const ActivityDesc = styled.div`
  display: flex;
  flex: 1 0;
  margin-top: 7px;
  margin-left: 10px;
  max-width: 100%;
  overflow: hidden;

  ${is('isCompact')`
    justify-content: space-between;
  `};
`;

const AuthorName = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #393636;
  text-decoration: none;
`;

const ActivityLeft = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
`;

const ActivityDate = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 9px 0 20px;
  margin-top: -6px;
  margin-right: -8px;
  font-size: 12px;
  line-height: 15px;
  color: #959595;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 1)
  );
  user-select: none;
  cursor: initial;
`;

const ActivityText = styled.div`
  color: #959595;
  font-size: 16px;
  font-weight: 300;
  max-width: 100%;
  ${breakWordStyles};

  ${is('isCompact')`
    color: #757575;
  `};

  ${is('withPadding')`
    padding-top: 12px;
  `};

  & a {
    color: #959595;
    font-weight: 500;
    text-decoration: underline;
    max-width: 100%;
    ${breakWordStyles};
  }
`;

const LeftSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  margin-left: 6px;
  color: #2879ff;
`;

const FollowWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  margin-top: 15px;
  margin-left: 10px;
`;

const AvatarLink = styled(Link)`
  padding: 0 3px;
  flex-shrink: 0;
`;

const icons = {
  vote: {
    name: 'like',
    size: 14,
  },
  flag: {
    name: 'dislike',
    size: 14,
  },
  transfer: {
    name: 'coins',
    width: 14,
    height: 11,
  },
  reply: {
    name: 'comment',
    size: 12,
  },
  subscribe: {
    name: 'radion-checked',
    size: 14,
  },
  unsubscribe: {
    name: 'round-cross',
    size: 14,
  },
  mention: {
    name: 'round-user',
    size: 14,
  },
  repost: {
    name: 'repost',
    size: 14,
  },
  reward: {
    name: 'coins',
    width: 23,
    height: 18,
  },
  curatorReward: {
    name: 'coins',
    width: 23,
    height: 18,
  },
  witnessVote: null,
  witnessCancelVote: null,
};

export default class ActivityItem extends Component {
  static propTypes = {
    notification: PropTypes.shape({}).isRequired,
    isCompact: PropTypes.bool,

    markAsViewed: PropTypes.func.isRequired,
    fetchComment: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isCompact: false,
  };

  state = {};

  render() {
    const { notification, isCompact } = this.props;
    let leftSide = null;
    let nameLink = null;
    let followBlock = null;
    let isRewards = false;

    const type = notification.eventType;

    if (['reward', 'curatorReward'].includes(type)) {
      leftSide = (
        <LeftSide>
          <Icon {...icons[type]} />
        </LeftSide>
      );
      isRewards = true;
    }

    if (notification.actor) {
      const account = notification.actor;

      const { id: userId, avatarUrl } = account;
      const name = account.name || userId;

      leftSide = (
        <AvatarLink route="profile" params={{ userId }}>
          <Avatar avatarUrl={avatarUrl} size={40} icon={icons[type]} />
        </AvatarLink>
      );

      if (!isRewards) {
        nameLink = (
          <AuthorName route="profile" params={{ userId }}>
            {name || userId}
          </AuthorName>
        );
      }

      if (type === 'subscribe') {
        followBlock = (
          <FollowWrapper isCompact={isCompact}>
            <Follow userId={userId} collapseOnMobile collapse={isCompact} />
          </FollowWrapper>
        );
      }
    }

    let translateId;

    switch (type) {
      case 'upvote':
      case 'downvote':
        if (notification.comment) {
          translateId = `${type}_comment`;
        } else {
          translateId = type;
        }
        break;
      default:
        translateId = type;
    }

    return (
      <Wrapper>
        <Content>
          {leftSide}
          <ActivityDesc isCompact={isCompact}>
            <ActivityLeft>
              {nameLink}
              <ActivityText isCompact={isCompact} withPadding={isRewards}>
                <Interpolate with={getPropsForInterpolation(notification)} component="div">
                  {tt(['notifications', 'activity', translateId], {
                    interpolate: false,
                  })}
                </Interpolate>
              </ActivityText>
            </ActivityLeft>
            {followBlock}
            <ActivityDate>
              <TimeAgoWrapper date={notification.timestamp} />
            </ActivityDate>
          </ActivityDesc>
        </Content>
      </Wrapper>
    );
  }
}
