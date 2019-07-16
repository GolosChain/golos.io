import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import TransferLine from '../TransferLine';
import { displayError } from '../../../../../utils/toastMessages';
import throttle from 'lodash.throttle';
import tt from 'counterpart';

const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  opacity: 0;
  animation: fade-in 0.25s forwards;
  animation-delay: 0.25s;
`;

const Lines = styled.div``;

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
  transfers,
  currency,
  direction,
  sequenceKey,
  isHistoryEnd,
  getTransfersHistory,
}) {
  const listRef = useRef();

  const loadHistory = useCallback(async () => {
    try {
      if (!isHistoryEnd) {
        await getTransfersHistory({ userId, currencies: [currency], direction, sequenceKey });
      }
    } catch (err) {
      displayError(err);
    }
  });

  useEffect(() => {
    const onScrollLazy = throttle(
      () => {
        if (
          listRef.current &&
          listRef.current.getBoundingClientRect().bottom < window.innerHeight * 1.2
        ) {
          loadHistory();
        }
      },
      500,
      { leading: false }
    );

    loadHistory();
    window.addEventListener('scroll', onScrollLazy);

    return () => {
      window.removeEventListener('scroll', onScrollLazy);
    };
  }, []);

  if (!transfers) {
    return (
      <LoaderWrapper>
        <LoadingIndicator type="circle" size={40} />
      </LoaderWrapper>
    );
  }

  if (!transfers.length) {
    return <EmptyBlock>{tt('user_wallet.content.empty_list')}</EmptyBlock>;
  }

  return (
    <Lines ref={listRef}>
      {transfers.map(transfer => (
        <TransferLine key={transfer.id} transfer={transfer} direction={direction} />
      ))}
    </Lines>
  );
}
