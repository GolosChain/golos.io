import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { CardContent } from 'components/golos-ui/Card';
import LinkTabs from 'components/common/LinkTabs';

import Transfers from '../wallet/Transfers';
import Rewards from '../wallet/Rewards';
import Vestings from '../wallet/Vestings';
import Genesis from '../wallet/Genesis';

const CardContentStyled = styled(CardContent)`
  display: block;
  padding: 0;
`;

const NoSection = styled.div`
  padding: 28px 20px 30px;
  font-size: 20px;
  font-weight: 500;
  color: #c5c5c5;
`;

const TABS = [
  {
    section: 'transfers',
    index: true,
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
  render() {
    const { userId, isGenesisUser, sections } = this.props;

    let tabs = TABS.map(({ index, section, translation }) => ({
      id: section,
      to: `/@${userId}/wallet${section && !index ? `/${section}` : ''}`,
      title: tt(translation),
    }));

    if (!isGenesisUser) {
      tabs = tabs.filter(({ id }) => id !== 'genesis');
    }

    let content = null;
    const selected = sections[0] || null;

    const tab = TABS.find(({ section, index }) => {
      if (!selected && index) {
        return true;
      }

      return section === selected;
    });

    if (tab) {
      content = <tab.Comp userId={userId} sections={sections.slice(1)} />;
    } else {
      content = <NoSection>Раздел не найден</NoSection>;
    }

    return (
      <>
        <LinkTabs tabs={tabs} activeTab={tab?.section || null} />
        <CardContentStyled>{content}</CardContentStyled>
      </>
    );
  }
}
