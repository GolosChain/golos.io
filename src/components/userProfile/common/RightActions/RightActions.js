import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'shared/routes';
import tt from 'counterpart';
import styled from 'styled-components';
import { ToggleFeature } from '@flopflip/react-redux';

import Icon from 'components/golos-ui/Icon';

import { RIGHTACTIONS_BUY_OR_SELL, RIGHTACTIONS_DELEGATE } from 'shared/feature-flags';
import { openTransferDialog, openDelegateDialog, openConvertDialog } from './showDialogs';

const Wrapper = styled.div``;

const Action = styled.a`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  box-sizing: content-box;
  border-bottom: 1px solid #e9e9e9;
  font-size: 12px;
  font-weight: 500;
  color: #393636;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
  user-select: none;
  transition: color 0.15s;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #000;
  }
`;

const ActionIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  flex-shrink: 0;
`;

const ActionTitle = styled.div`
  letter-spacing: 0.5px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default class RightActions extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    loggedUserId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
  };

  onTransferClick = async () => {
    const { userId, loggedUserId } = this.props;
    const recipientName = userId !== loggedUserId ? userId : null;
    await openTransferDialog(loggedUserId, recipientName);
  };

  onDelegateClick = async () => {
    const { userId } = this.props;
    await openDelegateDialog(userId);
  };

  onConvertClick = async () => {
    await openConvertDialog();
  };

  render() {
    const { isOwner } = this.props;

    return (
      <Wrapper>
        <ToggleFeature flag={RIGHTACTIONS_BUY_OR_SELL}>
          {isOwner && (
            <Link route="/market" passHref>
              <Action>
                <ActionIcon name="wallet" />
                <ActionTitle>{tt('user_profile.actions.buy_or_sell')}</ActionTitle>
              </Action>
            </Link>
          )}
        </ToggleFeature>
        <Action onClick={this.onTransferClick}>
          <ActionIcon name="coins" />
          <ActionTitle>{tt('user_profile.actions.transfer')}</ActionTitle>
        </Action>
        <ToggleFeature flag={RIGHTACTIONS_DELEGATE}>
          <Action onClick={this.onDelegateClick}>
            <ActionIcon name="voice" />
            <ActionTitle>{tt('user_profile.actions.delegate_vesting_shares')}</ActionTitle>
          </Action>
        </ToggleFeature>
        {isOwner && (
          <Action onClick={this.onConvertClick}>
            <ActionIcon name="refresh" />
            <ActionTitle>{tt('user_profile.actions.convert')}</ActionTitle>
          </Action>
        )}
      </Wrapper>
    );
  }
}
