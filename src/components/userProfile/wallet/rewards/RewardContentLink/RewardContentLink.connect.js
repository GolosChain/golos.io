import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';
import { getNotifyMeta } from 'store/actions/gate';
import { formatContentId } from 'store/schemas/gate';
import RewardContentLink from './RewardContentLink';

export default connect(
  (state, props) => ({
    contentMeta: entitySelector('contentMetas', formatContentId(props.contentId))(state),
  }),
  {
    getNotifyMeta,
  }
)(RewardContentLink);
