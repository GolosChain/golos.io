import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { removeRegistrationData } from 'utils/localStorage';
import { MODAL_CANCEL } from 'store/constants/modalTypes';
import { Circle, LastScreenTitle, LastScreenSubTitle, SendButton } from '../commonStyled';

const Start = styled(SendButton)`
  margin: 98px 0 23px;
`;

export default class Congratulations extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    clearRegistrationData: PropTypes.func.isRequired,
  };

  startClick = () => {
    const { close } = this.props;
    this.clearRegistrationData();
    close({ status: MODAL_CANCEL });
  };

  clearRegistrationData() {
    const { clearRegistrationData } = this.props;
    clearRegistrationData();
    removeRegistrationData();
  }

  render() {
    return (
      <>
        <Circle />
        <LastScreenTitle>{tt('registration.congratulations')}</LastScreenTitle>
        <LastScreenSubTitle>
          {tt('registration.you_have_been_registered_successfully')}
        </LastScreenSubTitle>
        <Start className="js-CongratulationsStart" onClick={this.startClick}>
          {tt('registration.start')}
        </Start>
      </>
    );
  }
}
