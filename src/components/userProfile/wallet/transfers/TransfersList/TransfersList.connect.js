import { connect } from 'react-redux';

import { userWalletSelector } from 'store/selectors/wallet';
import { getTransfersHistory } from 'store/actions/gate';

import TransfersList from './TransfersList';

export default connect(
  (state, { currency, direction, userId }) => {
    const transfers = userWalletSelector(userId, ['transfers', currency, direction])(state);

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
