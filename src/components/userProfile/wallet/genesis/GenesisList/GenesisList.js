import React, { useEffect } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import GenesisLine from '../GenesisLine';

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

export default function GenesisList({
  router: {
    query: { userId },
  },
  isLoading,
  items,
  getGenesisConversions,
}) {
  useEffect(() => {
    getGenesisConversions({ userId });
  }, []);

  return (
    <>
      <div>
        {items.map(convertion => (
          <GenesisLine key={convertion.id} convertion={convertion} />
        ))}
      </div>
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
