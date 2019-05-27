import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import tt from 'counterpart';
import SplashLoader from 'components/golos-ui/SplashLoader';
import Card from 'components/golos-ui/Card';
import { TabContainer, Tabs } from 'components/golos-ui/Tabs';

import Common from './settings/Common';
import Account from './settings/Account';
import Keys from './settings/Keys';
// import Notifications from './settings/Notifications'; // TODO: uncomment after realize push and email
import Online from './settings/notifications/Online';

const CardStyled = styled(Card)`
  width: 566px;
`;

export default class SettingsShow extends PureComponent {
  static propTypes = {
    profile: PropTypes.shape({}).isRequired,
    publicKeys: PropTypes.shape({}).isRequired,
    options: PropTypes.shape({}).isRequired,
    isFetching: PropTypes.bool.isRequired,

    onSubmitBlockchain: PropTypes.func.isRequired,
    onSubmitGate: PropTypes.func.isRequired,
  };

  render() {
    const {
      profile,
      publicKeys,
      options,
      isFetching,
      onSubmitBlockchain,
      onSubmitGate,
    } = this.props;

    return (
      <CardStyled>
        {isFetching && <SplashLoader />}
        <Tabs activeTab={{ id: 'commonTab' }}>
          <TabContainer id="commonTab" title={tt('settings_jsx.tabs.common')}>
            <Common options={options} isFetching={isFetching} onSubmitGate={onSubmitGate} />
          </TabContainer>
          <TabContainer id="accountTab" title={tt('settings_jsx.tabs.account')}>
            <Account
              profile={profile}
              options={options}
              isFetching={isFetching}
              onSubmitBlockchain={onSubmitBlockchain}
            />
          </TabContainer>
          <TabContainer id="notificationsTab" title={tt('settings_jsx.tabs.notifications')}>
            <Online options={options} onSubmitGate={onSubmitGate} />
            {/* <Notifications
              options={options}
              isFetching={isFetching}
              onSubmitGate={onSubmitGate}
            /> */}
          </TabContainer>
          <TabContainer id="keysTab" title={tt('settings_jsx.tabs.keys')}>
            <Keys username={profile.username} publicKeys={publicKeys} />
          </TabContainer>
        </Tabs>
      </CardStyled>
    );
  }
}
