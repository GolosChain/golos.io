import React from 'react';
import { storiesOf } from '@storybook/react';

import Card, { CardContent } from 'components/golos-ui/Card';
import TabContainer from './TabContainer';
import Tabs from './Tabs';

const Tab1 = () => <div>This is tab 1</div>;
const Tab2 = () => <div>This is tab 2</div>;

storiesOf('Golos UI/Tabs', module).add('default', () => (
  <Card>
    <Tabs
      activeTab={{
        id: 'tab1',
      }}
    >
      <CardContent>
        <TabContainer id="tab1" title="Tab 1">
          <Tab1 />
        </TabContainer>
        <TabContainer id="tab2" title="Tab 2">
          <Tab2 />
        </TabContainer>
      </CardContent>
    </Tabs>
  </Card>
));
