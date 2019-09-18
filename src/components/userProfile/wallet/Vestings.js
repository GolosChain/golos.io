import React from 'react';

import { LinkTabsContent } from 'components/common/LinkTabs';

import VestingsList from './vestings/VestingsList';
import VestingDelegations from './vestings/VestingDelegations';

const TABS = [
  {
    id: 'history',
    index: true,
    translation: 'user_wallet.tab_title.vesting_history',
  },
  {
    id: 'delegation',
    translation: 'user_wallet.tab_title.vesting_delegation',
  },
];

export default function Vestings({ userId, url, sections }) {
  return (
    <LinkTabsContent tabs={TABS} activeTab={sections[0] || TABS[0].id} url={url}>
      {(tab, props) => {
        switch (tab.id) {
          case 'history':
            return <VestingsList userId={userId} />;
          case 'delegation':
            return <VestingDelegations sections={sections.slice(1)} {...props} userId={userId} />;
          default:
            return null;
        }
      }}
    </LinkTabsContent>
  );
}
