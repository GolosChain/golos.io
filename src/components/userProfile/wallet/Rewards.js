import React from 'react';

import { LinkTabsContent } from 'components/common/LinkTabs';
import RewardsList from './rewards/RewardsList';

const TABS = [
  {
    id: 'all',
    index: true,
    translation: 'user_wallet.tab_title.all',
  },
  {
    id: 'benefeciary',
    translation: 'user_wallet.tab_title.beneficiary_rewards',
  },
  {
    id: 'curators',
    translation: 'user_wallet.tab_title.curation_rewards',
  },
  {
    id: 'author',
    translation: 'user_wallet.tab_title.author_rewards',
  },
  {
    id: 'delegator',
    translation: 'user_wallet.tab_title.delegation_rewards',
  },
];

export default function Rewards({ userId, sections }) {
  const baseUrl = `/@${userId}/wallet/rewards`;

  const tabs = TABS.map(tab => ({
    ...tab,
    to: `${baseUrl}${tab.index ? '' : `/${tab.id}`}`,
  }));

  return (
    <LinkTabsContent tabs={tabs} activeTab={sections[0] || null}>
      {tab => <RewardsList type={tab.id} />}
    </LinkTabsContent>
  );
}
