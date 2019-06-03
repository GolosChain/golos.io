import { connect } from 'react-redux';

import { formatContentId } from 'store/schemas/gate';
import { entitySelector } from 'store/selectors/common';
import { reblog } from 'store/actions/cyberway/publish';

import RepostDialog from './RepostDialog';

export default connect(
  (state, props) => {
    const post = entitySelector('posts', formatContentId(props.contentId))(state);

    return {
      post,
    };
  },
  {
    reblog,
  },
  null,
  { forwardRef: true }
)(RepostDialog);
