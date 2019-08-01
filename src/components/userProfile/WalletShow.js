import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { CardContent } from 'components/golos-ui/Card';
import LinkTabs from 'components/common/LinkTabs';

import Transfers from './wallet/Transfers';
import Rewards from './wallet/Rewards';
import Vestings from './wallet/Vestings';
import Genesis from './wallet/Genesis';

const CardContentStyled = styled(CardContent)`
  display: block;
  padding: 0;
`;

const TABS = [
  {
    section: null,
    translation: 'user_wallet.tab_title.transaction_history',
    Comp: Transfers,
  },
  {
    section: 'rewards',
    translation: 'user_wallet.tab_title.rewards',
    Comp: Rewards,
  },
  {
    section: 'vesting',
    translation: 'user_wallet.tab_title.vesting_history',
    Comp: Vestings,
  },
  {
    section: 'genesis',
    translation: 'user_wallet.tab_title.genesis_history',
    Comp: Genesis,
  },
];

export default class WalletShow extends PureComponent {
  renderContent() {
    const { sections } = this.props;
    const selected = sections[0] || null;

    const tab = TABS.find(({ section }) => section === selected);

    if (!tab) {
      return null;
    }

    return <tab.Comp sections={sections.slice(1)} />;
  }

  render() {
    const { userId } = this.props;

    const tabs = TABS.map(({ section, translation }) => ({
      to: `/@${userId}/wallet${section ? `/${section}` : ''}`,
      title: tt(translation),
    }));

    return (
      <>
        <LinkTabs tabs={tabs} />
        <CardContentStyled>{this.renderContent()}</CardContentStyled>
      </>
    );
  }
}
