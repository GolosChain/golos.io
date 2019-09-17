import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { userVestingBalanceSelector } from 'store/selectors/wallet';

import EditGolosPower from './EditGolosPower';

export default connect(state => {
  const userId = currentUserIdSelector(state);
  const vesting = userVestingBalanceSelector(userId)(state);

  return {
    vesting,
  };
})(EditGolosPower);
