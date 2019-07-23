import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { dataSelector } from 'store/selectors/common';
import { getTransfersHistory } from 'store/actions/gate';
import TransfersList from './TransfersList';

export default compose(
  withRouter,
  connect(
    (state, { router, currency, direction }) => {
      const { userId } = router.query;
      const transfers = dataSelector(['wallet', userId, 'transfers', currency, direction])(state);
      return {
        isLoading: transfers?.isLoading,
        items: transfers?.items,
        sequenceKey: transfers?.sequenceKey,
        isHistoryEnd: transfers?.isHistoryEnd,
      };
    },
    {
      getTransfersHistory,
    }
  )
)(TransfersList);
