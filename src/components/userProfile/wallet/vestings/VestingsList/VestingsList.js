import React, { useEffect } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import EmptyBlock from 'components/common/EmptyBlock';
import VestingLine from '../VestingLine';

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
  vestings,
  sequenceKey,
  getVestingHistory,
}) {
  useEffect(() => {
    getVestingHistory({ userId, sequenceKey });
  }, []);

  if (!vestings) {
    return (
      <LoaderWrapper>
        <LoadingIndicator type="circle" size={40} />
      </LoaderWrapper>
    );
  }

  if (!vestings.length) {
    return <EmptyBlock>{tt('user_wallet.content.empty_list')}</EmptyBlock>;
  }

  return (
    <Lines>
      {vestings.map(vesting => (
        <VestingLine key={vesting.id} vesting={vesting} />
      ))}
    </Lines>
  );
}
