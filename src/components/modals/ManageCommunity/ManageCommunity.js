import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SplashLoader from 'components/golos-ui/SplashLoader/SplashLoader';
import { displayError } from 'utils/toastMessages';

import ChooseContract from './ChooseContract';
import ContactSettings from './ContactSettings';

export const STEPS = {
  INITIAL: 'INITIAL',
  CHANGE_PARAMS: 'CHANGE_PARAMS',
};

const Wrapper = styled.div`
  position: relative;
  min-width: 600px;
  max-width: 600px;
  padding: 20px 0 28px;
  border-radius: 6px;
  background-color: #fff;
`;

const HeaderTitle = styled.h1`
  padding: 0 30px 0;
  margin: 0 0 10px 0;
`;

export default class ManageCommunity extends PureComponent {
  static propTypes = {
    close: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    getCommunitySettings: PropTypes.func.isRequired,
  };

  state = {
    step: STEPS.INITIAL,
    stepData: null,
    currentSettings: null,
  };

  settingsRef = createRef();

  componentDidMount() {
    this.loadCurrentSettings();
  }

  async loadCurrentSettings() {
    const { getCommunitySettings, close } = this.props;

    try {
      const { contracts } = await getCommunitySettings();

      this.setState({
        currentSettings: contracts,
      });
    } catch (err) {
      displayError("Can't load current settings");
      close();
    }
  }

  onStepChange = ({ step, data }) => {
    this.setState({
      step,
      stepData: data,
    });
  };

  onClose = () => {
    const { close } = this.props;
    close();
  };

  canClose() {
    if (this.settingsRef.current) {
      return this.settingsRef.current.canClose();
    }

    return true;
  }

  renderContent() {
    const { step, stepData, currentSettings } = this.state;

    switch (step) {
      case STEPS.INITIAL:
        return (
          <ChooseContract data={stepData} onStepChange={this.onStepChange} onClose={this.onClose} />
        );
      case STEPS.CHANGE_PARAMS:
        return (
          <ContactSettings
            ref={this.settingsRef}
            data={stepData}
            currentSettings={currentSettings}
            onStepChange={this.onStepChange}
            onClose={this.onClose}
          />
        );
      default:
        throw new Error('Invalid invariant');
    }
  }

  render() {
    const { currentSettings } = this.state;

    return (
      <Wrapper>
        <HeaderTitle>Параметры сообщества</HeaderTitle>
        {this.renderContent()}
        {!currentSettings ? <SplashLoader /> : null}
      </Wrapper>
    );
  }
}
