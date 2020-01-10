import { connect } from 'react-redux';

import { isSSRSelector } from 'store/selectors/ui';

import Search from './Search';

export default connect(state => ({
  isSSR: isSSRSelector(state),
}))(Search);
