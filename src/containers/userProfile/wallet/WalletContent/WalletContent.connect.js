import { connect } from 'react-redux';

import { profileSelector } from 'store/selectors/common';
import { currentUnsafeUserIdSelector } from 'store/selectors/auth';

import WalletContent from './WalletContent';

export default connect((state, props) => {
  const currentUserId = currentUnsafeUserIdSelector(state);
  const profile = profileSelector(props.userId)(state);

  return {
    currentUserId,
    profile,
  };
})(WalletContent);
