import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import Interpolate from 'react-interpolate-component';

import Card from 'components/golos-ui/Card';
import Button from 'components/golos-ui/Button';
import { displayError, displaySuccess } from 'utils/toastMessages';
import { normalizeCyberwayErrorMessage } from 'utils/errors';
import WalletUtils from 'utils/wallet';
import SmartLink from 'components/common/SmartLink';

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
  margin-top: 8px;
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

const Action = styled(Button)`
  height: 24px;
  line-height: 25px;
  padding: 0 12px;
  margin-left: 8px;
  font-size: 11px;
`;

export default class VestingDelegationProposals extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        initiatorId: PropTypes.string.isRequired,
        proposalId: PropTypes.string.isRequired,
        expirationTime: PropTypes.string.isRequired,
        action: PropTypes.shape({
          args: PropTypes.shape({
            quantity: PropTypes.string.isRequired,
            interestRate: PropTypes.number.isRequired,
          }).isRequired,
        }).isRequired,
        serializedTransaction: PropTypes.string.isRequired,
      })
    ).isRequired,
    fetchVestingProposals: PropTypes.func.isRequired,
    acceptVestingProposal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.loadVestingProposals();
  }

  async loadVestingProposals() {
    const { fetchVestingProposals } = this.props;

    try {
      await fetchVestingProposals();
    } catch (err) {
      displayError(err);
    }
  }

  onAcceptClick = async ({ proposalId }) => {
    const { acceptVestingProposal } = this.props;

    try {
      try {
        await acceptVestingProposal({ proposalId });
      } catch (err) {
        displayError(err);
      }

      displaySuccess(tt('wallet.success'));
    } catch (err) {
      displayError(tt('g.error'), err);
    }
  };

  renderItem = (item, i) => {
    return <div>{JSON.stringify(item, null, 2)}</div>;

    const { balance, supply } = this.props;

    let value;

    if (supply) {
      value = WalletUtils.convertVestingToToken({
        vesting: item.data.quantity,
        type: 'string',
        balance,
        supply,
      });
    } else {
      value = item.data.quantity;
    }

    return (
      <Item key={item.proposalId}>
        <Position>{i + 1}.</Position>
        <Text>
          <Interpolate
            with={{
              from: (
                <SmartLink
                  route="profile"
                  params={{ username: item.username, userId: item.userId }}
                >
                  {item.username || item.userId}
                </SmartLink>
              ),
              amount: value,
              interest: item.data.interestRate,
            }}
          >
            {tt('wallet.vesting_delegation_proposal_text', {
              interpolate: false,
            })}
          </Interpolate>
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
