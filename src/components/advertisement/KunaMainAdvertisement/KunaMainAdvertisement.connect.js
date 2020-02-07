import { connect } from 'react-redux';

import { UIModeSelector } from 'store/selectors/ui';

import KunaMainAdvertisement from './KunaMainAdvertisement';

export default connect(state => ({
  isMobile: UIModeSelector('screenType')(state) === 'mobile',
}))(KunaMainAdvertisement);
