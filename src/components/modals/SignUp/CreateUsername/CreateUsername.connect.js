import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { setWishUsername } from 'store/actions/registration';
import { fetchSetUser } from 'store/actions/gate/registration';
import { clearRegErrors } from 'store/actions/registration/registration';
import { statusSelector } from 'store/selectors/common';
import { regDataSelector } from 'store/selectors/registration';

import CreateUsername from './CreateUsername';

export default connect(
  createSelector(
    [statusSelector('registration'), regDataSelector],
    ({ isLoadingSetUser, sendUserError }, { wishUsername }) => ({
      wishUsername,
      isLoadingSetUser,
      sendUserError,
    })
  ),
  {
    setWishUsername,
    fetchSetUser,
    clearRegErrors,
  }
)(CreateUsername);
