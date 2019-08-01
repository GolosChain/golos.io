import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { CardContent } from 'components/golos-ui/Card';
import { TabContainer, Tabs } from 'components/golos-ui/Tabs';

import Transfers from './wallet/Transfers';
import Vestings from './wallet/Vestings';
import Rewards from './wallet/Rewards';
import Genesis from './wallet/Genesis';

const CardContentStyled = styled(CardContent)`
  display: block;
  padding: 0;
`;

const TABS = {
  TRANSFERS: 'TRANSFERS',
  DELEGATIONS: 'DELEGATIONS',
  REWARDS: 'REWARDS',
  VESTINGS: 'VESTINGS',
  GENESIS: 'GENESIS',
};

export default class WalletShow extends PureComponent {
  render() {
    return (
      <Tabs activeTab={{ id: TABS.TRANSFERS }}>
        <CardContentStyled>
          <TabContainer id={TABS.TRANSFERS} title={tt('user_wallet.tab_title.transaction_history')}>
            <Transfers />
          </TabContainer>
          <TabContainer id={TABS.REWARDS} title={tt('user_wallet.tab_title.rewards')}>
            <Rewards />
          </TabContainer>
          <TabContainer id={TABS.VESTINGS} title={tt('user_wallet.tab_title.vesting_history')}>
            <Vestings />
          </TabContainer>
          <TabContainer id={TABS.GENESIS} title={tt('user_wallet.tab_title.genesis_history')}>
            <Genesis />
          </TabContainer>
        </CardContentStyled>
      </Tabs>
    );
  }
}
