import React, { useCallback } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { displayError } from 'utils/toastMessages';
import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import RewardLine from '../RewardLine';

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

export default function RewardsList({
  userId,
  type,
  isLoading,
  items,
  sequenceKey,
  isHistoryEnd,
  getRewardsHistory,
}) {
  const onNeedLoadMore = useCallback(async () => {
    try {
      await getRewardsHistory({ userId, types: [type], sequenceKey });
    } catch (err) {
      displayError(err);
    }
  }, [getRewardsHistory, sequenceKey]);

  return (
    <>
      <InfinityScrollHelper disabled={isHistoryEnd || isLoading} onNeedLoadMore={onNeedLoadMore}>
        {items.map(reward => (
          <RewardLine key={reward.id} reward={reward} />
        ))}
      </InfinityScrollHelper>
      {!isLoading && !items.length ? (
        <EmptyBlock>{tt('user_wallet.content.empty_list')}</EmptyBlock>
      ) : null}
      {isLoading ? (
        <LoaderWrapper>
          <LoadingIndicator type="circle" size={40} />
        </LoaderWrapper>
      ) : null}
    </>
  );
}
