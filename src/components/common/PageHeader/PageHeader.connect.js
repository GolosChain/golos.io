import { connect } from 'react-redux';

import { currentUnsafeUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';

import PageHeader from './PageHeader';

export default connect(state => {
  const userId = currentUnsafeUserIdSelector(state);
  const profile = entitySelector('profiles', userId)(state);

  return {
    hideActions: !userId,
    isLoading: Boolean(userId && !profile),
  };
})(PageHeader);
