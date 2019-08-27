import { connect } from 'react-redux';

import { currentUserIdSelector } from 'store/selectors/auth';
import { profileSelector } from 'store/selectors/common';
import { openTransferDialog } from 'store/actions/modals';

import AboutPanel from './AboutPanel';

export default connect(
  (state, { post }) => {
    const currentUserId = currentUserIdSelector(state);

    return {
      currentUserId,
      profile: profileSelector(post.author)(state),
    };
  },
  {
    openTransferDialog,
  }
)(AboutPanel);
