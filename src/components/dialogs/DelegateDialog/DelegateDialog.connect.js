import { connect } from 'react-redux';

import { currentUsernameSelector } from 'store/selectors/auth';
import { delegateTokens, stopDelegateTokens } from 'store/actions/cyberway/vesting';

import DelegateDialog from './DelegateDialog';

export default connect(
  state => {
    /*const myAccount = myUser ? state.global.getIn(['accounts', myUser.get('username')]) : null;*/
    const currentUsername = currentUsernameSelector(state);
    return {
      currentUsername,
      globalProps: {} /*state.global.get('props')*/,
      chainProps: {} /*state.global.get('chain_properties')*/,
    };
  },
  {
    delegateTokens,
    stopDelegateTokens,
    fetchChainProperties: () => () => console.error('Unhandled action'),
    showNotification: () => () => console.error('Unhandled action'),
  },
  null,
  { forwardRef: true }
)(DelegateDialog);
