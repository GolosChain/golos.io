import { connect } from 'react-redux';

import { showLinkOptionsDialog } from 'store/actions/modals';

import MarkdownEditorToolbar from './MarkdownEditorToolbar';

export default connect(
  null,
  {
    showLinkOptionsDialog,
  }
)(MarkdownEditorToolbar);
