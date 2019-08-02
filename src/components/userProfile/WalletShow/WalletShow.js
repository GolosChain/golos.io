import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { CardContent } from 'components/golos-ui/Card';
import { LinkTabsContent } from 'components/common/LinkTabs';

import Transfers from '../wallet/Transfers';
import Rewards from '../wallet/Rewards';
import Vestings from '../wallet/Vestings';
import Genesis from '../wallet/Genesis';

const CardContentStyled = styled(CardContent)`
  display: block;
  padding: 0;
`;

const TABS = [
  {
    id: 'transfers',
    index: true,
    translation: 'user_wallet.tab_title.transaction_history',
    Comp: Transfers,
  },
  {
    id: 'rewards',
    translation: 'user_wallet.tab_title.rewards',
    Comp: Rewards,
  },
  {
    id: 'vesting',
    translation: 'user_wallet.tab_title.vesting_history',
    Comp: Vestings,
  },
  {
    id: 'genesis',
    translation: 'user_wallet.tab_title.genesis_history',
    Comp: Genesis,
  },
];

export default class WalletShow extends PureComponent {
  render() {
    const { userId, isGenesisUser, sections } = this.props;

    let tabs = TABS.map(tab => ({
      ...tab,
      to: `/@${userId}/wallet${tab.index ? '' : `/${tab.id}`}`,
    }));

    if (!isGenesisUser) {
      tabs = tabs.filter(({ id }) => id !== 'genesis');
    }

    return (
      <>
        <LinkTabsContent tabs={tabs} activeTab={sections[0] || 'transfers'}>
          {tab => (
            <CardContentStyled>
              <tab.Comp userId={userId} sections={sections.slice(1)} />
            </CardContentStyled>
          )}
        </LinkTabsContent>
      </>
    );
  }
}
