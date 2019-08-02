import React from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { Link } from 'shared/routes';
import { TabsContainer, TabsList } from 'components/golos-ui/Tabs/styles';
import Tab, { TabLink } from 'components/golos-ui/Tab';

const NoSection = styled.div`
  padding: 28px 20px 30px;
  font-size: 20px;
  font-weight: 500;
  color: #c5c5c5;
`;

export default function LinkTabs({ tabs, activeTab }) {
  let items;

  if (activeTab !== undefined) {
    items = tabs.map(({ id, to, translation }) => (
      <Link key={to} to={to} passHref>
        <Tab isLink className={id === activeTab ? 'active' : null}>
          {tt(translation)}
        </Tab>
      </Link>
    ));
  } else {
    items = tabs.map(({ to, translation }) => (
      <TabLink key={to} route={to} isLink>
        {tt(translation)}
      </TabLink>
    ));
  }

  return (
    <TabsContainer>
      <TabsList>{items}</TabsList>
    </TabsContainer>
  );
}

export function LinkTabsContent({ tabs, children, activeTab }) {
  const tab = tabs.find(({ id }) => activeTab === id);

  return (
    <>
      <LinkTabs tabs={tabs} activeTab={tab?.id || null} />
      {tab ? children(tab) : <NoSection>Раздел не найден</NoSection>}
    </>
  );
}
