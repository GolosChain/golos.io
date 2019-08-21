import { connect } from 'react-redux';

import { suggestNames } from 'store/actions/gate';

import AccountNameInput from './AccountNameInput';

export default connect(
  null,
  {
    suggestNames,
  }
)(AccountNameInput);
