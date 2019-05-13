import { connect } from 'react-redux';

import { statusSelector } from 'store/selectors/common';
import { blockChainStopLoader, fetchToBlockChain } from 'store/actions/gate/registration';
import { clearRegErrors } from 'store/actions/registration/registration';

import MasterKey from './MasterKey';

export default connect(
  state => {
    const { isLoadingBlockChain, blockChainError } = statusSelector('registration')(state);
    return {
      isLoadingBlockChain,
      blockChainError,
    };
  },
  {
    fetchToBlockChain,
    blockChainStopLoader,
    clearRegErrors,
  }
)(MasterKey);
