import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { userBalanceSelector } from 'store/selectors/wallet';
import { approveProposal, execProposal } from 'store/actions/cyberway';

import VestingDelegationProposals from './VestingDelegationProposals';

export default connect(
  (state, props) => {
    const { balance, supply } = dataSelector(['wallet'])(state);

    return {
      items: userBalanceSelector(props.userId)(state)?.vestingDelegationProposals,
      balance,
      supply,
    };
  },
  {
    approveProposal,
    execProposal,
  }
)(VestingDelegationProposals);
