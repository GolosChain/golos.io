import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { Link } from 'shared/routes';
import Userpic from 'components/common/Userpic';

const AccountInfoBlock = styled.a`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  height: 100%;
  padding: 0 8px 0 12px;

  color: #393636;
  user-select: none;
  cursor: pointer;

  &:hover,
  &:focus {
    color: #393636;
  }
`;

const AccountText = styled.div`
  margin: 0 0 0 12px;
`;

const AccountName = styled.div`
  max-width: 120px;
  line-height: 18px;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AccountPowerBlock = styled.div`
  display: flex;
  margin-top: 3px;
  line-height: 18px;
`;

const AccountPowerValue = styled.span`
  color: #2879ff;
  font-size: 13px;
`;

const AccountPowerBar = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const AccountPowerChunk = styled.div`
  width: 4px;
  height: 14px;
  margin: 0 1px;
  border-radius: 2px;
  background: #cde0ff;

  ${is('fill')`
    background: #2879ff;
  `};
`;

export default class AccountInfo extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    votingPower: PropTypes.number.isRequired,
  };

  render() {
    const { votingPower, username, userId } = this.props;

    const powerPercent = formatPower(votingPower);

    return (
      <Link route="profile" params={{ userId }} passHref>
        <AccountInfoBlock>
          <Userpic userId={userId} size={36} ariaLabel={tt('aria_label.avatar')} />
          <AccountText>
            <AccountName>{username}</AccountName>
            <AccountPowerBlock>
              <AccountPowerBar title={tt('header.voice_power', { voicePower: powerPercent })}>
                <AccountPowerChunk fill={votingPower > 10 ? 1 : 0} />
                <AccountPowerChunk fill={votingPower > 30 ? 1 : 0} />
                <AccountPowerChunk fill={votingPower > 50 ? 1 : 0} />
                <AccountPowerChunk fill={votingPower > 70 ? 1 : 0} />
                <AccountPowerChunk fill={votingPower > 90 ? 1 : 0} />
              </AccountPowerBar>
              <AccountPowerValue>{powerPercent}%</AccountPowerValue>
            </AccountPowerBlock>
          </AccountText>
        </AccountInfoBlock>
      </Link>
    );
  }
}

function formatPower(percent) {
  return percent.toFixed(2).replace(/\.?0+$/, '');
}
