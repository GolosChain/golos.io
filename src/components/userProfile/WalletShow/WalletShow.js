import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { withRouter } from 'next/router';

import { CardContent } from 'components/golos-ui/Card';
import { LinkTabsContent } from 'components/common/LinkTabs';
import { getUserRoute } from 'components/common/SmartLink';

import Transfers from '../wallet/Transfers';
import Rewards from '../wallet/Rewards';
import Vestings from '../wallet/Vestings';
import Genesis from '../wallet/Genesis';
import Claim from '../wallet/Claim';

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
    translation: 'user_wallet.tab_title.vesting',
    Comp: Vestings,
  },
  {
    id: 'claim',
    translation: 'user_wallet.tab_title.claim',
    Comp: Claim,
  },
  {
    id: 'genesis',
    translation: 'user_wallet.tab_title.genesis_history',
    Comp: Genesis,
  },
];

@withRouter
export default class WalletShow extends PureComponent {
  render() {
    const { router, userId, isGenesisUser, sections } = this.props;

    let tabs = TABS;

    if (!isGenesisUser) {
      tabs = TABS.filter(({ id }) => id !== 'genesis');
    }

    return (
      <LinkTabsContent
        tabs={tabs}
        activeTab={sections[0] || 'transfers'}
        url={`/${getUserRoute(router.query)}/wallet`}
      >
        {(tab, props) => (
          <CardContentStyled>
            <tab.Comp userId={userId} sections={sections.slice(1)} {...props} />
          </CardContentStyled>
        )}
      </LinkTabsContent>
    );
  }
}
