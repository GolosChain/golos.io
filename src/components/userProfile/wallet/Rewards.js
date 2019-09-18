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

export default function Rewards({ sections, url, userId }) {
  return (
    <LinkTabsContent tabs={TABS} activeTab={sections[0] || TABS[0].id} url={url}>
      {tab => <RewardsList type={tab.id} userId={userId} />}
    </LinkTabsContent>
  );
}
