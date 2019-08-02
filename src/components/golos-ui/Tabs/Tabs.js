import React, { Component } from 'react';

import { Link } from 'shared/routes';

import { TabsConsumer, TabsProvider } from './TabsContext';
import { TabsContainer, TabsList, TabTitleItem } from './styles';

export default class Tabs extends Component {
  renderTabsList(context) {
    return context.tabs.map(tab => {
      const tabItem = (
        <TabTitleItem
          key={tab.id}
          isLink={Boolean(tab.route)}
          id={tab.id}
          active={context.activeTab.id === tab.id ? 1 : 0}
          onClick={() => {
            if (this.props.onChange) {
              this.props.onChange(tab);
            }
            context.onClick(tab);
          }}
        >
          {tab.title}
        </TabTitleItem>
      );

      if (tab.route) {
        return (
          <Link key={tab.id} route={tab.route} params={tab.params} scroll={false} passHref>
            {tabItem}
          </Link>
        );
      }

      return tabItem;
    });
  }

  render() {
    const { activeTab, children } = this.props;

    return (
      <TabsProvider activeTab={activeTab}>
        <TabsConsumer>
          {({ context }) => (
            <>
              <TabsContainer>
                <TabsList>{this.renderTabsList(context)}</TabsList>
                {/* TODO: Fix the handler */}
                {/* <TabActiveBorder
                  style={{
                    width: activeTabRef.offsetWidth,
                    left: activeTabRef.offsetLeft,
                  }}
                /> */}
              </TabsContainer>
              {children}
            </>
          )}
        </TabsConsumer>
      </TabsProvider>
    );
  }
}
