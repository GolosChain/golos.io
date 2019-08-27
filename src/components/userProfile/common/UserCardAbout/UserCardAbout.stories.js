import React from 'react';
import { storiesOf } from '@storybook/react';

import UserCardAbout from './UserCardAbout.connect';

storiesOf('User Profile/common/UserCardAbout', module).add('default', () => (
  <UserCardAbout style={{ width: '273px' }} />
));
