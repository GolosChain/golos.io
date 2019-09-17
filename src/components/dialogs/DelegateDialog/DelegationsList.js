import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import SmartLink from 'components/common/SmartLink';

import { DelegationType } from './types';

const Root = styled.div``;

const DelegationLines = styled.div`
  overflow-y: auto;
  height: 230px;
  margin-bottom: 1px;
`;

const DelegationLine = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0;
`;

const DelegationsHeader = styled(DelegationLine)`
  font-weight: bold;
`;

const To = styled.div`
  min-width: 200px;
  flex-basis: 200px;
  flex-grow: 2;
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Value = styled.div`
  margin-right: 12px;
  flex-basis: 150px;
  flex-grow: 1;
  text-align: right;
`;

const Action = styled.div`
  flex-basis: 120px;
  flex-grow: 0;
  flex-shrink: 0;
  text-align: right;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 4px;
  border-radius: 100px;
  font-size: 14px;
  background: transparent;
  color: #333;
  cursor: pointer;
  transition: color 0.15s, background-color 0.25s;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: #fff;
    background: ${props => (props.red ? '#fc544e' : '#3684ff')};
  }
`;

const EmptyList = styled.div`
  height: 264px;
  padding-top: 20px;
  text-align: center;
  font-weight: 500;
  font-size: 20px;
  color: #999;
`;

export default class DelegationsList extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(DelegationType).isRequired,
    onEditClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
  };

  render() {
    const { items, onEditClick, onCancelClick } = this.props;

    return (
      <Root>
        {items.length ? (
          <>
            <DelegationsHeader>
              <To>{tt('dialogs_transfer.to')}</To>
              <Value>{tt('dialogs_transfer.delegate_vesting.tabs.delegated.amount')}</Value>
              <Action>{tt('dialogs_transfer.delegate_vesting.tabs.delegated.actions')}</Action>
            </DelegationsHeader>
            <DelegationLines>
              {items.map(delegation => (
                <DelegationLine key={delegation.to}>
                  <To>
                    <SmartLink
                      route="profile"
                      params={{ userId: delegation.to, username: delegation.toUsername }}
                    >
                      <a>{delegation.toUsername || delegation.to}</a>
                    </SmartLink>
                  </To>
                  <Value>{delegation.quantity.GOLOS}</Value>
                  <Action>
                    {/*TODO: Fix button logic */}
                    {/*<ActionButton*/}
                    {/*  data-tooltip={tt('dialogs_transfer.delegate_vesting.tabs.delegated.edit')}*/}
                    {/*  onClick={() => onEditClick(delegation.to)}*/}
                    {/*>*/}
                    {/*  <Icon name="pen" size={14} />*/}
                    {/*</ActionButton>*/}
                    <ActionButton
                      red
                      data-tooltip={tt('dialogs_transfer.delegate_vesting.tabs.delegated.cancel')}
                      onClick={() => onCancelClick(delegation)}
                    >
                      <Icon name="cross" size={12} />
                    </ActionButton>
                  </Action>
                </DelegationLine>
              ))}
            </DelegationLines>
          </>
        ) : (
          <EmptyList>{tt('g.empty_list')}</EmptyList>
        )}
      </Root>
    );
  }
}
