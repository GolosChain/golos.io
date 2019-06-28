import React from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import { TabContainer, Tabs } from 'components/golos-ui/Tabs';

import Current from './keys/Current';
import ResetKey from './keys/ResetKey';

const Keys = ({ profile, publicKeys }) => (
  <Tabs activeTab={{ id: 'currentKeysTab' }}>
    <TabContainer id="currentKeysTab" title={tt('settings_jsx.keys.tabs.keys')}>
      <Current profile={profile} publicKeys={publicKeys} />
    </TabContainer>
    <TabContainer id="newKeyTab" title={tt('settings_jsx.keys.tabs.new')}>
      <ResetKey username={profile.username} publicKeys={publicKeys} />
    </TabContainer>
  </Tabs>
);

Keys.propTypes = {
  username: PropTypes.string.isRequired,
  publicKeys: PropTypes.shape({}).isRequired,
};

export default Keys;
