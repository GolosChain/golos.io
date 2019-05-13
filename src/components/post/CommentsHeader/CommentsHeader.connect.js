import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { UICommentSortSelector } from 'store/selectors/ui';
import { setCommentsFilter } from 'store/actions/ui';

import CommentsHeader from './CommentsHeader';

export default connect(
  createStructuredSelector({
    sortCategory: UICommentSortSelector,
  }),
  { setCommentsFilter }
)(CommentsHeader);
