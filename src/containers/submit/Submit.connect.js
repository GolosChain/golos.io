import { connect } from 'react-redux';

import { isSSRSelector } from 'store/selectors/ui';

import Submit from './Submit';

export default connect(state => ({
  isSSR: isSSRSelector(state),
}))(Submit);
