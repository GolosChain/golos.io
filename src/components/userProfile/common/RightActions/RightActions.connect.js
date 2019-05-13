import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';

import RightActions from './RightActions';

export default connect((state, props) => {
  const loggedUserId = currentUserIdSelector(state);

  return {
    loggedUserId,
    isOwner: props.userId === loggedUserId,
  };
})(RightActions);
