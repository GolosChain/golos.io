import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Card from 'components/golos-ui/Card';
import { displayError, displaySuccess } from 'utils/toastMessages';
import { normalizeCyberwayErrorMessage } from 'utils/errors';

const CardStyled = styled(Card)`
  padding: 12px 20px;
  margin-bottom: 14px;
`;

const CardTitle = styled.h2`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const List = styled.ul``;

const Item = styled.li`
  display: flex;
  margin: 8px 0;
`;

const Position = styled.span`
  margin-right: 8px;
  font-weight: 500;
`;

const Text = styled.p`
  flex-grow: 1;
`;

const Actions = styled.div`
  flex-shrink: 0;
`;

const Action = styled.button`
  margin-left: 8px;
`;

export default class VestingDelegationProposals extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        proposer: PropTypes.string.isRequired,
        proposalId: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        username: PropTypes.string,
        expiration: PropTypes.string.isRequired,
        data: PropTypes.shape({
          quantity: PropTypes.string.isRequired,
          interestRate: PropTypes.number.isRequired,
        }),
      })
    ).isRequired,
  };

  onAcceptClick = async ({ proposer, proposalId }) => {
    const { approveProposal, execProposal, deleteDelegationVestingProposal } = this.props;

    try {
      try {
        await approveProposal({ proposer, proposalId });
      } catch (err) {
        const normalizedError = normalizeCyberwayErrorMessage(err);

        // Эта ошибка чаще всего значит, что человек уже заапрувил пропозал ранее, поэтому игнорируем её.
        if (normalizedError !== 'approval is not on the list of requested approvals') {
          throw err;
        }
      }

      await execProposal({ proposer, proposalId });

      displaySuccess(tt('wallet.success'));
    } catch (err) {
      displayError(tt('g.error'), err);
    }
  };

  renderItem = (item, i) => {
    return (
      <Item key={item.proposalId}>
        <Position>{i + 1}.</Position>
        <Text>
          {tt('wallet.vesting_delegation_proposal_text', {
            from: item.username || item.userId,
            amount: item.data.quantity,
            interest: item.data.interestRate,
          })}
        </Text>
        <Actions>
          <Action onClick={() => this.onAcceptClick(item)}>{tt('g.accept')}</Action>
        </Actions>
      </Item>
    );
  };

  render() {
    const { items } = this.props;

    if (!items || items.length === 0) {
      return null;
    }

    return (
      <CardStyled>
        <CardTitle>{tt('wallet.vesting_delegation_proposals')}:</CardTitle>
        <List>{items.map(this.renderItem)}</List>
      </CardStyled>
    );
  }
}
