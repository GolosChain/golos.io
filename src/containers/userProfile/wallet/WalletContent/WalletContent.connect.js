import { connect } from 'react-redux';
import { profileSelector } from 'store/selectors/common';

import WalletContent from './WalletContent';

export default connect((state, props) => {
  const profile = profileSelector(props.userId)(state);

  return {
    profile,
  };
})(WalletContent);
