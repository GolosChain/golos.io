import { connect } from 'react-redux';

import { profileSelector } from 'store/selectors/common';
import { currentUserIdSelector } from 'store/selectors/auth';

import WalletContent from './WalletContent';

export default connect((state, props) => {
  const currentUserId = currentUserIdSelector(state);
  const profile = profileSelector(props.userId)(state);

  return {
    currentUserId,
    profile,
  };
})(WalletContent);
