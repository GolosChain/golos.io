import React from 'react';

import { Link } from 'shared/routes';
import { TabsContainer, TabsList } from 'components/golos-ui/Tabs/styles';
import Tab, { TabLink } from 'components/golos-ui/Tab';

export default function LinkTabs({ tabs, activeTab }) {
  let items;

  if (activeTab !== undefined) {
    items = tabs.map(({ id, to, title }) => (
      <Link key={to} to={to} passHref>
        <Tab isLink className={id === activeTab ? 'active' : null}>
          {title}
        </Tab>
      </Link>
    ));
  } else {
    items = tabs.map(({ to, title }) => (
      <TabLink key={to} route={to} isLink>
        {title}
      </TabLink>
    ));
  }

  return (
    <TabsContainer>
      <TabsList>{items}</TabsList>
    </TabsContainer>
  );
}
