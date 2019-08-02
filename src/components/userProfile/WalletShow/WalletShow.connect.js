import { connect } from 'react-redux';

import { profileSelector } from 'store/selectors/common';

import WalletShow from './WalletShow';

export default connect((state, props) => {
  const profile = profileSelector(props.userId)(state);

  return {
    isGenesisUser: Boolean(profile?.isGenesisUser),
  };
})(WalletShow);
