import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { getGenesisConversions } from 'store/actions/gate';
import GenesisList from './GenesisList';

export default connect(
  (state, { userId }) => {
    const genesis = dataSelector(['wallet', 'users', userId, 'genesis'])(state);
    return {
      isLoading: Boolean(genesis?.isLoading),
      items: genesis?.items || [],
    };
  },
  {
    getGenesisConversions,
  }
)(GenesisList);
