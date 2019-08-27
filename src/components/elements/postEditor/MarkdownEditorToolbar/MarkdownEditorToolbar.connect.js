import { connect } from 'react-redux';

import { showLinkOptionsDialog, showAddImageDialog } from 'store/actions/modals';

import MarkdownEditorToolbar from './MarkdownEditorToolbar';

export default connect(
  null,
  {
    showLinkOptionsDialog,
    showAddImageDialog,
  }
)(MarkdownEditorToolbar);
