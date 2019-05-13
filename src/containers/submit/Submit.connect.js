import { connect } from 'react-redux';

import { uiSelector } from 'store/selectors/common';

import Submit from './Submit';

export default connect(state => ({
  isSSR: uiSelector(['mode', 'isSSR'])(state),
}))(Submit);
