import React, { useCallback } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { displayError } from 'utils/toastMessages';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import TransferLine from '../TransferLine';
import InfinityScrollHelper from '../../../../common/InfinityScrollHelper';

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  opacity: 0;
  animation: fade-in 0.25s forwards;
  animation-delay: 0.25s;
`;

const EmptyBlock = styled.div`
  padding: 28px 20px 30px;
  font-size: 20px;
  font-weight: 500;
  color: #c5c5c5;
`;

export default function TransfersList({
  router: {
    query: { userId },
  },
  isLoading,
  items = [],
  currency,
  direction,
  sequenceKey,
  isHistoryEnd,
  getTransfersHistory,
}) {
  const onNeedLoadMore = useCallback(async () => {
    try {
      await getTransfersHistory({ userId, currencies: [currency], direction, sequenceKey });
    } catch (err) {
      displayError(err);
    }
  }, [getTransfersHistory, sequenceKey]);

  return (
    <InfinityScrollHelper disabled={isHistoryEnd || isLoading} onNeedLoadMore={onNeedLoadMore}>
      {items.map(transfer => (
        <TransferLine key={transfer.id} transfer={transfer} direction={direction} />
      ))}
      {!isLoading && !items.length ? (
        <EmptyBlock>{tt('user_wallet.content.empty_list')}</EmptyBlock>
      ) : null}
      {isLoading ? (
        <LoaderWrapper>
          <LoadingIndicator type="circle" size={40} />
        </LoaderWrapper>
      ) : null}
    </InfinityScrollHelper>
  );
}
