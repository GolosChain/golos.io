import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { fullNumberSelector } from 'store/selectors/registration';
import { statusSelector } from 'store/selectors/common';
import { fetchRegVerify, fetchResendSms } from 'store/actions/gate/registration';
import { clearRegErrors, clearVerifyError } from 'store/actions/registration/registration';

import ConfirmationCode from './ConfirmationCode';

export default connect(
  createSelector(
    [statusSelector('registration'), fullNumberSelector],
    (
      { isLoadingVerify, sendVerifyError, isResendSmsLoading, resendSmsError, nextSmsRetry },
      fullPhoneNumber
    ) => ({
      isLoadingVerify,
      sendVerifyError,
      isResendSmsLoading,
      resendSmsError,
      nextSmsRetry,
      fullPhoneNumber,
    })
  ),
  {
    fetchRegVerify,
    clearVerifyError,
    fetchResendSms,
    clearRegErrors,
  }
)(ConfirmationCode);
