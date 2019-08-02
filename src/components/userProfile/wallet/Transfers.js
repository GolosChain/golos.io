import React from 'react';

import { LinkTabsContent } from 'components/common/LinkTabs';

import TransfersList from './transfers/TransfersList';

function TransfersDirectionsTabs({ userId, currency, sections }) {
  const section = sections[0];
  const currencyLower = currency.toLowerCase();

  const walletUrl = `/@${userId}/wallet`;
  const currencyUrl = `${walletUrl}/transfers/${currencyLower}`;

  return (
    <LinkTabsContent
      tabs={[
        {
          id: 'all',
          translation: 'user_wallet.tab_title.all',
          to: currencyLower === 'all' ? walletUrl : currencyUrl,
          direction: 'all',
        },
        {
          id: 'sent',
          translation: 'user_wallet.tab_title.sent',
          to: `${currencyUrl}/sent`,
          direction: 'out',
        },
        {
          id: 'received',
          translation: 'user_wallet.tab_title.received',
          to: `${currencyUrl}/received`,
          direction: 'in',
        },
      ]}
      activeTab={section || 'all'}
    >
      {tab => <TransfersList currency={currency} direction={tab.direction} />}
    </LinkTabsContent>
  );
}

export default function Transfers({ userId, sections }) {
  return (
    <LinkTabsContent
      tabs={[
        {
          id: 'all',
          translation: 'user_wallet.tab_title.all',
          to: `/@${userId}/wallet`,
        },
        {
          id: 'golos',
          translation: 'user_wallet.tab_title.golos',
          to: `/@${userId}/wallet/transfers/golos`,
        },
      ]}
      activeTab={sections[0] || 'all'}
    >
      {tab => (
        <TransfersDirectionsTabs
          userId={userId}
          currency={tab.id === 'golos' ? 'GOLOS' : 'all'}
          sections={sections.slice(1)}
        />
      )}
    </LinkTabsContent>
  );
}
