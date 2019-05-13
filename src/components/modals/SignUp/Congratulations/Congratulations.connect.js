import { connect } from 'react-redux';

import { clearRegistrationData } from 'store/actions/registration';
import Congratulations from './Congratulations';

export default connect(
  null,
  {
    clearRegistrationData,
  }
)(Congratulations);
