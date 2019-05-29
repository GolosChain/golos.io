import React from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon';
import { getUserStatus } from 'helpers/users';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.57;
  color: #fff;
  font-size: 14px;

  & div:first-child {
    margin-right: 22px;
  }

  @media (max-width: 576px) {
    margin-top: 7px;
    color: #757575;
  }
`;

const Login = styled.div``;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserStatus = styled.p`
  margin: 0 0 0 4px;
  padding: 0;
`;

export default function LoginContainer({ targetUser, power }) {
  const userStatus = getUserStatus(power);

  return (
    <Wrapper>
      <Login>@{targetUser.username || targetUser.userId}</Login>
      {userStatus && (
        <StatusContainer>
          <Icon name={userStatus} width={15} height={15} />
          <UserStatus>{tt(`user_profile.account_summary.status.${userStatus}`)}</UserStatus>
        </StatusContainer>
      )}
    </Wrapper>
  );
}

LoginContainer.propTypes = {
  targetUser: PropTypes.shape(),
  power: PropTypes.number,
};
