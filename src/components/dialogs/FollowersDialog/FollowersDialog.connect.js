import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import FollowersDialog from './FollowersDialog';

export default connect((state, props) => ({
  profile: entitySelector('profiles', props.userId)(state),
}))(FollowersDialog);
