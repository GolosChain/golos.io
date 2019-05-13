import React, { Component } from 'react';

import { TabsConsumer } from './TabsContext';

export default class TabContainer extends Component {
  render() {
    const { id, title, route, params, children } = this.props;

    return (
      <TabsConsumer>
        {value => {
          value.context.addTab({ id, title, route, params });
          return value.context.activeTab.id === id && children;
        }}
      </TabsConsumer>
    );
  }
}
