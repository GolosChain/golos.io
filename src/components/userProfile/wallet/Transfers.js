import React from 'react';
import tt from 'counterpart';

import LinkTabs from 'components/common/LinkTabs';

import TransfersList from './transfers/TransfersList';

const DIRECTION = {
  ALL: 'all',
  OUT: 'out',
  IN: 'in',
};

function TransfersDirectionsTabs({ userId, currency, sections }) {
  const section = sections[0];

  const currencyLower = currency.toLowerCase();

  const walletUrl = `/@${userId}/wallet`;
  const currencyUrl = `${walletUrl}/transfers/${currencyLower}`;

  let direction;

  if (section === 'sent') {
    direction = DIRECTION.OUT;
  } else if (section === 'received') {
    direction = DIRECTION.IN;
  } else {
    direction = DIRECTION.ALL;
  }

  return (
    <>
      <LinkTabs
        tabs={[
          {
            title: tt('user_wallet.tab_title.all'),
            to: currencyLower === 'all' ? walletUrl : currencyUrl,
          },
          {
            title: tt('user_wallet.tab_title.sent'),
            to: `${currencyUrl}/sent`,
          },
          {
            title: tt('user_wallet.tab_title.received'),
            to: `${currencyUrl}/received`,
          },
        ]}
      />
      <TransfersList currency={currency} direction={direction} />
    </>
  );
}

export default function Transfers({ userId, sections }) {
  const section = sections[0] || 'all';

  return (
    <>
      <LinkTabs
        tabs={[
          {
            id: 'all',
            title: tt('user_wallet.tab_title.all'),
            to: `/@${userId}/wallet`,
          },
          {
            id: 'golos',
            title: tt('user_wallet.tab_title.golos'),
            to: `/@${userId}/wallet/transfers/golos`,
          },
        ]}
        activeTab={section}
      />
      <TransfersDirectionsTabs
        userId={userId}
        currency={section === 'golos' ? 'GOLOS' : 'all'}
        sections={sections.slice(1)}
      />
    </>
  );
}
