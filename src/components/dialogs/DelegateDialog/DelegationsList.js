import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'shared/routes';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

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

const Delegatee = styled.div`
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
    data: PropTypes.array.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
  };

  render() {
    const { data, onEditClick, onCancelClick } = this.props;

    debugger;

    return (
      <Root>
        {data.length ? (
          <>
            <DelegationsHeader>
              <Delegatee>{tt('dialogs_transfer.to')}</Delegatee>
              <Value>{tt('token_names.VESTING_TOKENS')}</Value>
              <Action>{tt('dialogs_transfer.delegate_vesting.tabs.delegated.actions')}</Action>
            </DelegationsHeader>
            <DelegationLines>
              {data.map(info => (
                <DelegationLine key={info.id}>
                  <Delegatee>
                    <Link route="profile" params={{ userId: info.delegatee }}>
                      <a>{info.delegatee}</a>
                    </Link>
                  </Delegatee>
                  <Value>{info.vesting_shares}</Value>
                  <Action>
                    <ActionButton
                      data-tooltip={tt('dialogs_transfer.delegate_vesting.tabs.delegated.edit')}
                      onClick={() => onEditClick(info.delegatee)}
                    >
                      <Icon name="pen" size={14} />
                    </ActionButton>
                    <ActionButton
                      red
                      data-tooltip={tt('dialogs_transfer.delegate_vesting.tabs.delegated.cancel')}
                      onClick={() => onCancelClick(info.delegatee, info.vesting_shares)}
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
