import React from 'react';

import { TabsContainer, TabsList } from 'components/golos-ui/Tabs/styles';
import { TabLink } from 'components/golos-ui/Tab';

export default function LinkTabs({ tabs }) {
  return (
    <TabsContainer>
      <TabsList>
        {tabs.map(({ to, title }) => (
          <TabLink key={to} route={to} isLink activeClassName="active">
            {title}
          </TabLink>
        ))}
      </TabsList>
    </TabsContainer>
  );
}
