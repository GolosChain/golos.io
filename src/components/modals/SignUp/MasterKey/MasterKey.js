import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import SplashLoader from 'components/golos-ui/SplashLoader';

import { setRegistrationData } from 'utils/localStorage';
import { CONGRATULATIONS_SCREEN_ID } from '../constants';
import {
  Circle,
  LastScreenTitle,
  LastScreenSubTitle,
  SendButton,
  ErrorText,
} from '../commonStyled';

const ActionButton = styled(SendButton)`
  margin: 40px 0 70px;
`;

const CustomErrorText = styled(ErrorText)`
  bottom: 40px;
`;

export default class MasterKey extends Component {
  static propTypes = {
    setScreenId: PropTypes.func.isRequired,
    fetchToBlockChain: PropTypes.func.isRequired,
    isLoadingBlockChain: PropTypes.bool.isRequired,
    blockChainError: PropTypes.string.isRequired,
    blockChainStopLoader: PropTypes.func.isRequired,
    clearRegErrors: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.sendToBlockChain();
  }

  componentWillUnmount() {
    const { clearRegErrors } = this.props;
    clearRegErrors();
  }

  actionButtonClick = () => {
    const { setScreenId, blockChainError } = this.props;
    if (blockChainError) {
      this.sendToBlockChain();
    } else {
      setScreenId(CONGRATULATIONS_SCREEN_ID);
      setRegistrationData({ screenId: CONGRATULATIONS_SCREEN_ID });
    }
  };

  async sendToBlockChain() {
    const { fetchToBlockChain, blockChainStopLoader, setScreenId } = this.props;

    try {
      const screenId = await fetchToBlockChain();
      if (screenId) {
        setScreenId(screenId);
        setRegistrationData({ screenId });
      }
      blockChainStopLoader();
    } catch (err) {
      blockChainStopLoader();
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  render() {
    const { isLoadingBlockChain, blockChainError } = this.props;

    return (
      <>
        {isLoadingBlockChain && <SplashLoader />}
        <Circle />
        <LastScreenTitle>{tt('registration.master_key_has_been_generated')}</LastScreenTitle>
        <LastScreenSubTitle>
          {tt('registration.you_need_master_key_for_sign_in')}
        </LastScreenSubTitle>
        <CustomErrorText>{blockChainError}</CustomErrorText>
        <ActionButton className="js-MasterKeyDownload" onClick={this.actionButtonClick}>
          {blockChainError ? tt('g.back') : tt('registration.next')}
        </ActionButton>
      </>
    );
  }
}
