import React from 'react';
import styled from 'styled-components';

import { TabContainer, Tabs } from 'components/golos-ui/Tabs';

import TransfersList from './transfers/TransfersList';
import tt from 'counterpart';

const TabsContent = styled.div``;

export const CURRENCY = {
  ALL: 'all',
  GOLOS: 'GOLOS',
};

export const DIRECTION = {
  ALL: 'all',
  OUT: 'out',
  IN: 'in',
};

function TransfersDirectionsTabs({ currency }) {
  return (
    <Tabs activeTab={{ id: DIRECTION.ALL }}>
      <TabsContent>
        <TabContainer id={DIRECTION.ALL} title={tt('user_wallet.tab_title.all')}>
          <TransfersList currency={currency} direction={DIRECTION.ALL} />
        </TabContainer>
        <TabContainer id={DIRECTION.OUT} title={tt('user_wallet.tab_title.sent')}>
          <TransfersList currency={currency} direction={DIRECTION.OUT} />
        </TabContainer>
        <TabContainer id={DIRECTION.IN} title={tt('user_wallet.tab_title.received')}>
          <TransfersList currency={currency} direction={DIRECTION.IN} />
        </TabContainer>
      </TabsContent>
    </Tabs>
  );
}

export default function Transfers() {
  return (
    <Tabs activeTab={{ id: CURRENCY.ALL }}>
      <TabsContent>
        <TabContainer id={CURRENCY.ALL} title={tt('user_wallet.tab_title.all')}>
          <TransfersDirectionsTabs currency={CURRENCY.ALL} />
        </TabContainer>
        <TabContainer id={CURRENCY.GOLOS} title={tt('user_wallet.tab_title.golos')}>
          <TransfersDirectionsTabs currency={CURRENCY.GOLOS} />
        </TabContainer>
      </TabsContent>
    </Tabs>
  );
}
