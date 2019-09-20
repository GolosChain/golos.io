import { connect } from 'react-redux';

import { userWalletSelector } from 'store/selectors/wallet';
import { getDelegationState } from 'store/actions/gate';

import VestingDelegations from './VestingDelegations';

export default connect(
  (state, props) => {
    const data = userWalletSelector(props.userId, 'delegations')(state);

    return {
      isLoading: data?.isLoading || false,
      error: data?.error || null,
      items: data?.items || null,
    };
  },
  {
    getDelegationState,
  }
)(VestingDelegations);
