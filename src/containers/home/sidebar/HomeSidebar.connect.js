import { connect } from 'react-redux';

import { UIModeSelector } from 'store/selectors/ui';

import HomeSidebar from './HomeSidebar';

export default connect(state => ({
  isMobile: UIModeSelector('screenType')(state) === 'mobile',
}))(HomeSidebar);
