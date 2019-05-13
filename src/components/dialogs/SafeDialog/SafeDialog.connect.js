/*
import { connect } from 'react-redux';

import { currentUsernameSelector } from 'store/selectors/auth';

import SafeDialog from './SafeDialog';

export default connect(
  state => {
    const currentUsername = currentUsernameSelector(state);
    /!*const myAccount = myUser ? state.global.getIn(['accounts', myUser.get('username')]) : null;*!/

    return {
      currentUsername,
    };
  },
  {
    transfer: () => () =>
      console.error(
        'Unhandled action'
      ) /!*(type, operation, callback) => dispatch =>
      dispatch(
        transaction.actions.broadcastOperation({
          type,
          operation,
          successCallback() {
            callback(null);

            if (location.pathname.endsWith('/transfers')) {
              dispatch(fetchCurrentStateAction());
            }
          },
          errorCallback(err) {
            callback(err);
          },
        })
      )*!/,
    showNotification: () => () => console.error('Unhandled action'),
  },
  null,
  { forwardRef: true }
)(SafeDialog);
*/

// deleted in new BlockChain
