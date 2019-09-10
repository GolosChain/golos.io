import { connect } from 'react-redux';

import { isSSRSelector } from 'store/selectors/ui';

import SmartLazyLoad from './SmartLazyLoad';

export default connect(state => ({
  isSSR: isSSRSelector(state),
}))(SmartLazyLoad);
