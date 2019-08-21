import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { getClaimHistory } from 'store/actions/gate';
import ClaimList from './ClaimList';

export default connect(
  (state, { userId }) => {
    const claim = dataSelector(['wallet', 'users', userId, 'claim'])(state);
    return {
      isLoading: Boolean(claim?.isLoading),
      items: claim?.claims || [],
      sequenceKey: claim?.sequenceKey,
      isHistoryEnd: Boolean(claim?.isHistoryEnd),
    };
  },
  {
    getClaimHistory,
  }
)(ClaimList);
