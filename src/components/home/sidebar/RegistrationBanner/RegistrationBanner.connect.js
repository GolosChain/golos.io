import { connect } from 'react-redux';

import { isUnsafeAuthorized } from 'store/selectors/auth';

import RegistrationBanner from './RegistrationBanner';

export default connect(state => ({
  isAuthorized: isUnsafeAuthorized(state),
}))(RegistrationBanner);
