import React from 'react';

import { LinkTabsContent } from 'components/common/LinkTabs';

import TransfersList from './transfers/TransfersList';

function TransfersDirectionsTabs({ currency, sections, url, fullUrl, userId }) {
  return (
    <LinkTabsContent
      url={url}
      fullUrl={fullUrl}
      tabs={[
        {
          id: 'all',
          index: true,
          translation: 'user_wallet.tab_title.all',
          direction: 'all',
        },
        {
          id: 'sent',
          translation: 'user_wallet.tab_title.sent',
          direction: 'out',
        },
        {
          id: 'received',
          translation: 'user_wallet.tab_title.received',
          direction: 'in',
        },
      ]}
      activeTab={sections[0] || 'all'}
    >
      {tab => <TransfersList currency={currency} direction={tab.direction} userId={userId} />}
    </LinkTabsContent>
  );
}

export default function Transfers({ userId, sections, url, fullUrl }) {
  return (
    <LinkTabsContent
      tabs={[
        {
          id: 'all',
          index: true,
          translation: 'user_wallet.tab_title.all',
        },
        {
          id: 'golos',
          translation: 'user_wallet.tab_title.golos',
        },
        {
          id: 'cyber',
          translation: 'user_wallet.tab_title.cyber',
        },
      ]}
      activeTab={sections[0] || 'all'}
      url={url}
      fullUrl={fullUrl}
    >
      {(tab, props) => (
        <TransfersDirectionsTabs
          userId={userId}
          currency={tab.id === 'all' ? 'all' : tab.id.toUpperCase()}
          sections={sections.slice(1)}
          {...props}
        />
      )}
    </LinkTabsContent>
  );
}
