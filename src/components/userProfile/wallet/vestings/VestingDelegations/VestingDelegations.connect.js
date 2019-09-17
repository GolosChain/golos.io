import { connect } from 'react-redux';

import { getDelegationState } from 'store/actions/gate';

import VestingDelegations from './VestingDelegations';

export default connect(
  null,
  {
    getDelegationState,
  }
)(VestingDelegations);
