import { connect } from 'react-redux';

import { userWalletSelector } from 'store/selectors/wallet';
import { getGenesisConversions } from 'store/actions/gate';

import GenesisList from './GenesisList';

export default connect(
  (state, { userId }) => {
    const genesis = userWalletSelector(userId, 'genesis')(state);

    return {
      isLoading: Boolean(genesis?.isLoading),
      items: genesis?.items || [],
    };
  },
  {
    getGenesisConversions,
  }
)(GenesisList);
