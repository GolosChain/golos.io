import React from 'react';

import { TabContainer, Tabs } from 'components/golos-ui/Tabs';

import Online from './notifications/Online';
import Push from './notifications/Push';
import Email from './notifications/Email';

export default function Notifications({ options, onSubmitGate }) {
  return (
    <Tabs activeTab={{ id: 'onlineTab' }}>
      <TabContainer id="onlineTab" title="Онлайн">
        <Online options={options} onSubmitGate={onSubmitGate} />
      </TabContainer>
      <TabContainer id="pushTab" title="Пуш">
        <Push options={options} onSubmitGate={onSubmitGate} />
      </TabContainer>
      <TabContainer id="emailTab" title="E-mail">
        <Email options={options} onSubmitGate={onSubmitGate} />
      </TabContainer>
    </Tabs>
  );
}
