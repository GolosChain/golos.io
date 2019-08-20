import { connect } from 'react-redux';

import { dataSelector } from 'store/selectors/common';
import { getTransfersHistory } from 'store/actions/gate';
import TransfersList from './TransfersList';

export default connect(
  (state, { currency, direction, userId }) => {
    const transfers = dataSelector(['wallet', 'users', userId, 'transfers', currency, direction])(
      state
    );

    return {
      isLoading: Boolean(transfers?.isLoading),
      items: transfers?.items || [],
      sequenceKey: transfers?.sequenceKey,
      isHistoryEnd: Boolean(transfers?.isHistoryEnd),
    };
  },
  {
    getTransfersHistory,
  }
)(TransfersList);
