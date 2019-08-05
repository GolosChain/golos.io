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

export default function LinkTabs({ tabs, activeTab, url, fullUrl }) {
  let items;

  if (activeTab !== undefined) {
    items = tabs.map(({ id, index, translation }) => {
      const to = index ? url : `${fullUrl || url}/${id}`;

      return (
        <Link key={to} to={to} shallow passHref>
          <Tab isLink className={id === activeTab ? 'active' : null}>
            {tt(translation)}
          </Tab>
        </Link>
      );
    });
  } else {
    items = tabs.map(({ id, index, translation }) => {
      const to = index ? url : `${fullUrl || url}/${id}`;

      return (
        <TabLink key={to} route={to} shallow isLink>
          {tt(translation)}
        </TabLink>
      );
    });
  }

  return (
    <TabsContainer>
      <TabsList>{items}</TabsList>
    </TabsContainer>
  );
}

export function LinkTabsContent({ tabs, children, activeTab, url, fullUrl }) {
  const tab = tabs.find(({ id }) => activeTab === id);

  let content = null;

  if (tab) {
    const innerFullUrl = `${fullUrl || url}/${tab.id}`;

    content = children(tab, {
      url: tab.index ? url : innerFullUrl,
      fullUrl: innerFullUrl,
    });
  } else {
    content = <NoSection>{tt('g.section_not_found')}</NoSection>;
  }

  return (
    <>
      <LinkTabs tabs={tabs} activeTab={tab?.id || null} url={url} fullUrl={fullUrl || url} />
      {content}
    </>
  );
}
