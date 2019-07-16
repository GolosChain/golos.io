import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

// import SplashLoader from 'components/golos-ui/SplashLoader';
import { CardContent } from 'components/golos-ui/Card';
import { TabContainer, Tabs } from 'components/golos-ui/Tabs';

import Transfers from './wallet/Transfers';
import Vestings from './wallet/Vestings';

const CardContentStyled = styled(CardContent)`
  display: block;
  padding: 0;
`;

const TABS = {
  TRANSFERS: 'TRANSFERS',
  DELEGATIONS: 'DELEGATIONS',
  REWARDS: 'REWARDS',
  VESTINGS: 'VESTINGS',
};

export default class WalletShow extends PureComponent {
  render() {
    return (
      <Tabs activeTab={{ id: TABS.TRANSFERS }}>
        <CardContentStyled>
          <TabContainer id={TABS.TRANSFERS} title={tt('user_wallet.tab_title.transaction_history')}>
            <Transfers />
          </TabContainer>
          {/*<TabContainer id={TABS.DELEGATIONS} title="getDelegationState">*/}
          {/*</TabContainer>*/}
          {/*<TabContainer id={TABS.REWARDS} title="getRewards">*/}
          {/*</TabContainer>*/}
          <TabContainer id={TABS.VESTINGS} title={tt('user_wallet.tab_title.vesting_history')}>
            <Vestings />
          </TabContainer>
        </CardContentStyled>
      </Tabs>
    );
  }
}
