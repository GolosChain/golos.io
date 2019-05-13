import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { statusSelector } from 'store/selectors/common';
import { regDataSelector } from 'store/selectors/registration';
import { setPhoneNumber, setLocationData } from 'store/actions/registration';
import { fetchRegFirstStep, firstStepStopLoader } from 'store/actions/gate/registration';
import { clearRegErrors } from 'store/actions/registration/registration';

import Phone from './Phone';

export default connect(
  createSelector(
    [statusSelector('registration'), regDataSelector],
    ({ isLoadingFirstStep, sendPhoneError, nextSmsRetry }, { phoneNumber, locationData }) => ({
      phoneNumber,
      locationData,
      nextSmsRetry,
      isLoadingFirstStep,
      sendPhoneError,
    })
  ),
  {
    setPhoneNumber,
    setLocationData,
    fetchRegFirstStep,
    firstStepStopLoader,
    clearRegErrors,
  }
)(Phone);
