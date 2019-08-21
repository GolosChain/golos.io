import { connect } from 'react-redux';

import { suggestNames } from 'store/actions/gate';
import { entitySelector } from 'store/selectors/common';

import AccountNameInput from './AccountNameInput';

export default connect(
  (state, props) => {
    let targetUser;

    if (props.value) {
      targetUser = entitySelector('users', props.value)(state);
    }

    return {
      username: targetUser?.username,
    };
  },
  {
    suggestNames,
  }
)(AccountNameInput);
