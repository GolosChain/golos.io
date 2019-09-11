import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import UnfollowDialog from './UnfollowDialog';

export default connect((state, props) => ({
  targetUsername: entitySelector('users', props.targetUserId)(state)?.username,
}))(UnfollowDialog);
