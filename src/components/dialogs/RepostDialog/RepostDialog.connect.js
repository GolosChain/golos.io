import { connect } from 'react-redux';

import { repost } from 'app/redux/actions/repost';
import { showNotification } from 'app/redux/actions/ui';
import { currentUsernameSelector } from 'store/selectors/auth';
import { sanitizeCardPostData } from 'app/redux/selectors/post/commonPost';
import RepostDialog from './RepostDialog';

export default connect(
  (state, props) => {
    const post = state.global.getIn(['content', props.postLink]);

    return {
      myAccountName: currentUsernameSelector(state),
      sanitizedPost: sanitizeCardPostData(post),
    };
  },
  {
    repost,
    showNotification,
  },
  null,
  { forwardRef: true }
)(RepostDialog);
