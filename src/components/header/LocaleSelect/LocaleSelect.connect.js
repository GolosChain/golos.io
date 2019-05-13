import { connect } from 'react-redux';

import { currentUsernameSelector } from 'store/selectors/auth';
import { saveLocale } from 'store/actions/settings/general';
import { changeLocale } from 'store/actions/ui';
import { UIModeSelector } from 'store/selectors/ui';
import LocaleSelect from './LocaleSelect';

export default connect(
  state => ({
    currentUser: currentUsernameSelector(state),
    locale: UIModeSelector('locale')(state),
  }),
  {
    changeLocale,
    saveLocale,
  }
)(LocaleSelect);
