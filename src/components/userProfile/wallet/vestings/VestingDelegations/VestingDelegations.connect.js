import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { getDelegationState } from 'store/actions/gate';

import VestingDelegations from './VestingDelegations';

export default connect(
  (state, props) => {
    const data = dataSelector(['wallet', 'users', props.userId, 'delegations'])(state);

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
