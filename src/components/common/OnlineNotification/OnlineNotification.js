import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import Interpolate from 'react-interpolate-component';
import { Toast } from 'toasts-manager';

import { Link } from 'shared/routes';
import { breakWordStyles } from 'helpers/styles';
import { getPropsForInterpolation } from 'helpers/notifications';

import Avatar from 'components/common/Avatar';
import Icon from 'components/golos-ui/Icon';

const LeftSide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  margin-right: 18px;
  color: #2879ff;
`;

const Message = styled.div`
  font-size: 14px;
  line-height: 20px;
  max-width: 100%;

  a {
    max-width: 100%;
    ${breakWordStyles};
  }
`;

export default class OnlineNotification extends PureComponent {
  static propTypes = {
    notification: PropTypes.shape({}),
  };

  render() {
    const { notification } = this.props;
    const { actor, eventType } = notification;

    let leftSide = null;

    if (['reward', 'curatorReward'].includes(eventType)) {
      leftSide = (
        <LeftSide>
          <Icon name="coins" width={23} height={18} />
        </LeftSide>
      );
    }

    if (actor) {
      leftSide = (
        <LeftSide>
          <Link route="profile" params={{ userId: actor.userId }}>
            <Avatar avatarUrl={actor.avatarUrl} size={40} />
          </Link>
        </LeftSide>
      );
    }

    return (
      <Toast>
        {leftSide}
        <Message>
          <Interpolate with={getPropsForInterpolation(notification)} component="div">
            {tt(['notifications', 'online', eventType], {
              interpolate: false,
            })}
          </Interpolate>
        </Message>
      </Toast>
    );
  }
}
