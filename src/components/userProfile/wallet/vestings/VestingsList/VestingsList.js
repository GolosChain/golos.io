import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import EmptyBlock from 'components/common/EmptyBlock';
import VestingLine from '../VestingLine';
import { displayError } from '../../../../../utils/toastMessages';
import throttle from 'lodash.throttle';

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

export default function VestingsList({
  router: {
    query: { userId },
  },
  items,
  sequenceKey,
  isHistoryEnd,
  getVestingHistory,
}) {
  const listRef = useRef();

  const loadHistory = useCallback(async () => {
    try {
      if (!isHistoryEnd) {
        await getVestingHistory({ userId, sequenceKey });
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
      onScrollLazy.cancel();
      window.removeEventListener('scroll', onScrollLazy);
    };
  }, [listRef.current, items]);

  if (!items) {
    return (
      <LoaderWrapper>
        <LoadingIndicator type="circle" size={40} />
      </LoaderWrapper>
    );
  }

  if (!items.length) {
    return <EmptyBlock>{tt('user_wallet.content.empty_list')}</EmptyBlock>;
  }

  return (
    <Lines ref={listRef}>
      {items.map(vesting => (
        <VestingLine key={vesting.id} vesting={vesting} />
      ))}
    </Lines>
  );
}
