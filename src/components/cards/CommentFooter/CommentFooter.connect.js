import { connect } from 'react-redux';

import { openTransferDialog } from 'store/actions/dialogs';

import CommentFooter from './CommentFooter';

export default connect(
  null,
  {
    openTransferDialog,
  }
)(CommentFooter);
