import React from 'react';

import { LinkTabsContent } from 'components/common/LinkTabs';

import TransfersDirections from './VestingDelegations.connect';

const TABS_DIRECTION = [
  {
    id: 'all',
    index: true,
    translation: 'user_wallet.tab_title.all',
    direction: 'all',
  },
  {
    id: 'out',
    translation: 'user_wallet.tab_title.sent',
    direction: 'out',
  },
  {
    id: 'in',
    translation: 'user_wallet.tab_title.received',
    direction: 'in',
  },
];

export default function VestingDelegationsTabs({ userId, sections, url, fullUrl }) {
  return (
    <LinkTabsContent
      tabs={TABS_DIRECTION}
      activeTab={sections[0] || TABS_DIRECTION[0].id}
      url={url}
      fullUrl={fullUrl}
    >
      {(tab, props) => (
        <TransfersDirections
          key={tab.id}
          userId={userId}
          currency={tab.id === 'all' ? 'all' : tab.id.toUpperCase()}
          direction={tab.id}
          sections={sections.slice(1)}
          {...props}
        />
      )}
    </LinkTabsContent>
  );
}
