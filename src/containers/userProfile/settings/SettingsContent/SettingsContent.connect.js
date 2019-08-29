import { connect } from 'react-redux';
import { isEmpty } from 'ramda';
import { getAccountPermissions } from 'cyber-client/lib/auth';

import { authProtection } from 'helpers/hoc';
import { fetchSettings, updateSettings } from 'store/actions/gate/settings';
import { fetchProfile, waitForTransaction } from 'store/actions/gate';

import { fetchAccountPermissions } from 'store/actions/cyberway/permissions';
import { updateProfileMeta } from 'store/actions/cyberway/social';
import { dataSelector, profileSelector } from 'store/selectors/common';

import SettingsContent from './SettingsContent';

export default authProtection()(
  connect(
    (state, props) => {
      const profile = profileSelector(props.userId)(state);
      const settingsData = dataSelector('settings')(state);

      return {
        profile,
        settingsData,
      };
    },
    {
      fetchSettings,
      fetchAccountPermissions,
      fetchProfile,
      updateSettings,
      updateProfileMeta,
      waitForTransaction,
    }
  )(SettingsContent)
);
