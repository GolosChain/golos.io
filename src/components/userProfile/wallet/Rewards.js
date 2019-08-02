import React from 'react';
import tt from 'counterpart';

import LinkTabs from 'components/common/LinkTabs';
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
  const selected = sections[0];

  const baseUrl = `/@${userId}/wallet/rewards`;

  const tabs = TABS.map(({ id, index, translation }) => ({
    id,
    to: `${baseUrl}${index ? '' : `/${id}`}`,
    title: tt(translation),
  }));

  const tab = TABS.find(({ id, index }) => {
    if (!selected && index) {
      return true;
    }

    return selected === id;
  });

  return (
    <>
      <LinkTabs tabs={tabs} activeTab={tab?.id || null} />
      {tab ? <RewardsList type={tab.id} /> : null}
    </>
  );
}
