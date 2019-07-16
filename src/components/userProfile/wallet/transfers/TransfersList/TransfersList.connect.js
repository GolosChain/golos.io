import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { createSelector } from 'reselect';

import { dataSelector } from 'store/selectors/common';
import { getTransfersHistory } from 'store/actions/gate';
import TransfersList from './TransfersList';

export default compose(
  withRouter,
  connect(
    createSelector(
      [
        (
          state,
          {
            router: {
              query: { userId },
            },
            direction,
          }
        ) => dataSelector(['wallet', userId, 'transfers', direction])(state),
      ],
      transfers => {
        return {
          transfers: transfers?.items,
          sequenceKey: transfers?.sequenceKey,
          isHistoryEnd: transfers?.isHistoryEnd,
        };
      }
    ),
    {
      getTransfersHistory,
    }
  )
)(TransfersList);
