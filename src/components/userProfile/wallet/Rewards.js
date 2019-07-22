import React from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { TabContainer, Tabs } from 'components/golos-ui/Tabs';

import RewardsList from './rewards/RewardsList';

const TabsContent = styled.div``;

export const REWARDS = {
  ALL: 'all',
  TRANSFER: 'transfer',
  BENEFECIARY: 'benefeciary',
  CURATORS: 'curators',
  AUTHOR: 'author',
  DELEGATOR: 'delegator',
};

export default function Rewards() {
  return (
    <Tabs activeTab={{ id: REWARDS.ALL }}>
      <TabsContent>
        <TabContainer id={REWARDS.ALL} title={tt('user_wallet.tab_title.all')}>
          <RewardsList type={REWARDS.ALL} />
        </TabContainer>
        <TabContainer
          id={REWARDS.BENEFECIARY}
          title={tt('user_wallet.tab_title.beneficiary_rewards')}
        >
          <RewardsList type={REWARDS.BENEFECIARY} />
        </TabContainer>
        <TabContainer id={REWARDS.CURATORS} title={tt('user_wallet.tab_title.curation_rewards')}>
          <RewardsList type={REWARDS.CURATORS} />
        </TabContainer>
        <TabContainer id={REWARDS.AUTHOR} title={tt('user_wallet.tab_title.author_rewards')}>
          <RewardsList type={REWARDS.AUTHOR} />
        </TabContainer>
        <TabContainer id={REWARDS.DELEGATOR} title={tt('user_wallet.tab_title.delegation_rewards')}>
          <RewardsList type={REWARDS.DELEGATOR} />
        </TabContainer>
      </TabsContent>
    </Tabs>
  );
}
