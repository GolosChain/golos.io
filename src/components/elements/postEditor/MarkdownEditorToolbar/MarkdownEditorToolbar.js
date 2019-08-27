import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import tt from 'counterpart';
import ToastsManager from 'toasts-manager';

import './index.scss';
import Icon from 'components/golos-ui/Icon';
import DialogManager from 'components/elements/common/DialogManager';
import AddImageDialog from 'components/dialogs/AddImageDialog';
import IconWrapper from 'components/common/IconWrapper';
import KEYS from 'utils/keyCodes';
import { uploadImage } from 'utils/uploadImages';

const MAX_HEADING = 4;
const TOOLBAR_OFFSET = 7;
const TOOLBAR_WIDTH = 468;
const TOOLBAR_COMMENT_WIDTH = 336;
const MIN_TIP_OFFSET = 29;

const PLUS_ACTIONS = [
  {
    id: 'picture',
    icon: 'editor-toolbar-picture',
    tooltip: 'post_editor.add_image',
  },
  {
    id: 'link',
    icon: 'editor-toolbar-link',
    tooltip: 'editor_toolbar.add_link',
    placeholder: 'editor_toolbar.enter_link',
  },
  {
    id: 'video',
    icon: 'editor-toolbar-video',
    tooltip: 'editor_toolbar.add_video',
    placeholder: 'editor_toolbar.enter_video_link',
  },
];

export default class MarkdownEditorToolbar extends React.PureComponent {
  static propTypes = {
    showLinkOptionsDialog: PropTypes.func.isRequired,
    showAddImageDialog: PropTypes.func.isRequired,
  };

  rootRef = createRef();

  constructor(props) {
    super(props);

    this._editor = props.editor;
    this._cm = this._editor.codemirror;

    this.state = {
      state: props.editor.getState(),
      toolbarShow: false,
      newLineOpen: false,
      selected: null,
    };

    this._onCursorActivityDelayed = () => {
      this._timeoutId = setTimeout(this._onCursorActivity, 5);
    };
  }

  componentDidMount() {
    this._delayedListenTimeout = setTimeout(() => {
      this._cm.on('cursorActivity', this._onCursorActivityDelayed);
      this._cm.on('focus', this._onCursorActivityDelayed);
      this._cm.on('blur', this._onBlur);
    }, 700);
    document.addEventListener('keydown', this._onGlobalKeyDown);
    document.addEventListener('mousedown', this._onGlobalMouseDown);

    this._initTimeout = setTimeout(() => {
      if (this._cm.hasFocus()) {
        this._onCursorActivity();
      }
    }, 500);
  }

  componentWillUnmount() {
    this._unmount = true;

    clearTimeout(this._initTimeout);
    clearTimeout(this._delayedListenTimeout);
    this._cm.off('cursorActivity', this._onCursorActivityDelayed);
    this._cm.off('focus', this._onCursorActivityDelayed);
    this._cm.off('blur', this._onBlur);
    document.removeEventListener('keydown', this._onGlobalKeyDown);
    document.removeEventListener('mousedown', this._onGlobalMouseDown);
    clearTimeout(this._timeoutId);
  }

  render() {
    const { commentMode, mobile } = this.props;
    const { newLineHelper } = this.state;

    return (
      <div
        className={cn('MET', {
          MET_comment: commentMode,
          MET_desktop: !mobile,
          MET_mobile: mobile,
        })}
        ref={this.rootRef}
        style={{ display: 'none' }}
      >
        {this._renderToolbar()}
        {newLineHelper ? this._renderHelper(newLineHelper) : null}
      </div>
    );
  }

  _renderToolbar() {
    const { SM, commentMode, mobile } = this.props;
    const { state, toolbarPosition, toolbarShow } = this.state;
    const root = this.rootRef.current;

    const editor = this._editor;

    const toolbarWidth = commentMode ? TOOLBAR_COMMENT_WIDTH : TOOLBAR_WIDTH;

    const style = {
      width: toolbarWidth,
    };

    let toolbarTipLeft = null;

    if (mobile) {
      style.top = 'auto';
      style.bottom = 0;
      style.left = 0;
      style.width = 'auto';
    } else if (toolbarPosition) {
      const rootPos = root.getBoundingClientRect();

      style.top = toolbarPosition.top - rootPos.top - TOOLBAR_OFFSET;

      if (toolbarPosition.left != null) {
        let left = Math.round(toolbarPosition.left - rootPos.left);
        toolbarTipLeft = toolbarWidth / 2;

        const deltaLeft = left - toolbarWidth / 2;

        if (deltaLeft < 0) {
          toolbarTipLeft = Math.max(MIN_TIP_OFFSET, left);
          left = toolbarWidth / 2;
        } else {
          const deltaRight = left + toolbarWidth / 2 - rootPos.width;

          if (deltaRight > 0) {
            toolbarTipLeft = Math.min(toolbarWidth - MIN_TIP_OFFSET, toolbarWidth / 2 + deltaRight);
            left = rootPos.width - toolbarWidth / 2;
          }
        }

        style.left = Math.round(left);
      }
    }

    const actions = [
      {
        active: state.bold,
        icon: 'editor-toolbar-bold',
        tooltip: tt('editor_toolbar.bold'),
        label: tt('editor_toolbar.bold'),
        onClick: () => SM.toggleBold(editor),
      },
      {
        active: state.italic,
        icon: 'editor-toolbar-italic',
        tooltip: tt('editor_toolbar.italic'),
        label: tt('editor_toolbar.italic'),
        onClick: () => SM.toggleItalic(editor),
      },
      commentMode
        ? null
        : {
            active: state.heading,
            icon: 'editor-toolbar-header',
            tooltip: tt('editor_toolbar.header'),
            label: tt('editor_toolbar.header'),
            onClick: this.onHeadingClick,
          },
      {
        active: state.strikethrough,
        icon: 'editor-toolbar-strike',
        tooltip: tt('editor_toolbar.strikethrough'),
        label: tt('editor_toolbar.strikethrough'),
        onClick: this.toggleStrikeThrough,
      },
      'SEPARATOR',
      {
        icon: 'editor-toolbar-bullet-list',
        tooltip: tt('editor_toolbar.unordered_list'),
        label: tt('editor_toolbar.unordered_list'),
        onClick: () => SM.toggleUnorderedList(editor),
      },
      {
        icon: 'editor-toolbar-number-list',
        tooltip: tt('editor_toolbar.ordered_list'),
        label: tt('editor_toolbar.ordered_list'),
        onClick: this.onToggleOrderedList,
      },
      'SEPARATOR',
      {
        active: state.quote,
        icon: 'editor-toolbar-quote',
        tooltip: tt('editor_toolbar.quote'),
        label: tt('editor_toolbar.quote'),
        onClick: () => SM.toggleBlockquote(editor),
      },
      {
        active: state.link,
        icon: 'editor-toolbar-link',
        tooltip: tt('editor_toolbar.add_link'),
        label: tt('editor_toolbar.add_link'),
        onClick: this.draw,
      },
      {
        icon: 'editor-toolbar-picture',
        tooltip: tt('editor_toolbar.add_image'),
        label: tt('editor_toolbar.add_image'),
        onClick: this.addImage,
      },
      {
        icon: 'editor-toolbar-video',
        tooltip: tt('editor_toolbar.add_video'),
        label: tt('editor_toolbar.add_video'),
        onClick: this.drawVideo,
      },
    ];

    return (
      <div
        className={cn('MET__toolbar', {
          MET__toolbar_raising: toolbarShow,
        })}
        style={style}
      >
        {toolbarTipLeft != null ? (
          <div
            className="MET__toolbar-tip"
            style={{
              left: toolbarTipLeft,
            }}
          />
        ) : null}
        {actions.map((action, i) =>
          !action ? null : action === 'SEPARATOR' ? (
            <i key={i} className="MET__separator" />
          ) : (
            <IconWrapper
              key={i}
              className={cn('MET__icon', {
                MET__icon_active: action.active,
              })}
              data-tooltip={action.tooltip}
              aria-label={action.label}
              onClick={action.onClick}
            >
              <Icon name={action.icon} height={18} />
            </IconWrapper>
          )
        )}
      </div>
    );
  }

  _renderHelper(pos) {
    const { commentMode, mobile } = this.props;
    const { newLineOpen, selected } = this.state;
    const root = this.rootRef.current;

    const action = selected ? PLUS_ACTIONS.find(a => a.id === selected) : null;

    return (
      <div
        className={cn('MET__new-line-helper', {
          'MET__new-line-helper_comment': commentMode,
          'MET__new-line-helper_open': newLineOpen,
          'MET__new-line-helper_selected': newLineOpen && selected,
          'MET__new-line-helper_mobile': mobile,
        })}
        style={{
          top: Math.round(pos.top - root.getBoundingClientRect().top - window.scrollY),
        }}
        onMouseDown={this._onMouseDown}
      >
        <IconWrapper className="MET__plus" onClick={this._onPlusClick}>
          <Icon name="editor-toolbar-plus" height={18} />
        </IconWrapper>
        <div
          className={cn('MET__new-line-actions', {
            'MET__new-line-actions_selected': selected,
          })}
        >
          {PLUS_ACTIONS.map(action => (
            <IconWrapper
              key={action.id}
              className="MET__new-line-item MET__new-line-icon"
              data-tooltip={tt(action.tooltip)}
              aria-label={tt(action.tooltip)}
              onClick={() => this._onActionClick(action.id)}
            >
              <Icon name={action.icon} height={21} />
            </IconWrapper>
          ))}
        </div>
        {action ? (
          <div className="MET__new-line-input-wrapper" key={action.id}>
            <IconWrapper
              className="MET__new-line-icon"
              onClick={this._onResetActionClick}
              data-tooltip={tt('g.cancel')}
            >
              <Icon name={action.icon} height={18} />
            </IconWrapper>
            <input
              className="MET__new-line-input"
              autoFocus
              placeholder={tt(action.placeholder)}
              onKeyDown={this._onInputKeyDown}
            />
          </div>
        ) : null}
      </div>
    );
  }

  _onCursorActivity = () => {
    this.setState({
      state: this._editor.getState(),
    });

    const cm = this._cm;

    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    const selection = cm.getSelection();

    if (line.trim() === '') {
      const pos = cm.cursorCoords();

      // Sometimes editor being in invalid state, skip it
      if (pos.top > 20000) {
        return;
      }

      this.setState({
        newLineHelper: {
          top: Math.ceil(pos.top + (pos.bottom - pos.top) / 2),
        },
        toolbarShow: false,
        newLineOpen: false,
        selected: null,
      });
      return;
    }

    const newState = {
      toolbarShow: false,
      newLineHelper: null,
    };

    if (selection) {
      const pos = cm.cursorCoords();

      const toolbarPosition = {
        top: Math.round(pos.top),
      };

      const selectionNode = document.querySelector('.CodeMirror-selectedtext');

      if (selectionNode) {
        const bound = selectionNode.getBoundingClientRect();

        toolbarPosition.top = Math.round(bound.top);
        toolbarPosition.left = Math.round(bound.left + bound.width / 2);
      }

      newState.toolbarShow = true;
      newState.toolbarPosition = toolbarPosition;
    }

    this.setState(newState);
  };

  _onPlusClick = () => {
    if (this.state.newLineOpen) {
      this.setState({
        newLineOpen: false,
      });
    } else {
      this.setState({
        newLineOpen: true,
        selected: null,
      });
    }
  };

  _onActionClick = id => {
    if (id === 'picture') {
      this.addImage();
    } else {
      this.setState({
        selected: id,
      });
    }
  };

  _onResetActionClick = () => {
    this.setState({
      selected: null,
    });
  };

  _onInputKeyDown = e => {
    if (e.which === KEYS.ENTER) {
      const { value } = e.target;
      e.target.value = '';

      this._makeNewLineAction(value);

      this.setState({
        newLineOpen: false,
        selected: null,
      });
    }
  };

  toggleStrikeThrough = () => {
    const cm = this._cm;

    const selection = cm.getSelection();
    const selectionTrimmed = selection.trim();

    if (selection !== selectionTrimmed && selectionTrimmed && !selection.includes('\n')) {
      const start = cm.getCursor('start');
      const end = cm.getCursor('end');

      cm.setSelection(
        {
          ch: start.ch + (selection.length - selection.trimLeft().length),
          line: start.line,
        },
        {
          ch: end.ch - (selection.length - selection.trimRight().length),
          line: end.line,
        }
      );
    }

    setTimeout(() => {
      this.props.SM.toggleStrikethrough(this._editor);
    });
  };

  _makeNewLineAction(text) {
    const { selected } = this.state;
    const cm = this._cm;

    if (selected === 'link') {
      const selection = cm.getSelection() || text;
      const cursor = cm.getCursor();

      cm.replaceSelection(`[${selection}](${text})`);

      cm.setSelection(
        {
          ch: cursor.ch + 1,
          line: cursor.line,
        },
        {
          ch: cursor.ch + selection.length + 1,
          line: cursor.line,
        }
      );

      setTimeout(() => {
        cm.focus();
      });
    } else if (selected === 'video') {
      cm.replaceSelection(this._processVideoUrl(text));
      cm.focus();
    } else {
      console.error('INVALID_CASE');
    }
  }

  draw = async () => {
    const { showLinkOptionsDialog } = this.props;
    const selection = this._cm.getSelection();

    const props = {
      text: '',
      link: '',
    };

    if (selection) {
      const match = selection.match(/^\[([^\]]*)\]\(([^)]*)\)$/);

      if (match) {
        props.text = match[1];
        props.link = match[2];
      } else if (/^http|^\/\//.test(selection)) {
        props.link = selection;
      } else {
        props.text = selection;
      }
    }

    const data = await showLinkOptionsDialog(props);

    if (!this._unmount && data) {
      this._cm.replaceSelection(`[${data.text}](${data.link})`);
    }
  };

  _insertLink(url, isImage) {
    const cm = this._cm;

    const startPoint = cm.getCursor('start');
    const selection = cm.getSelection();

    let offset;
    if (isImage) {
      cm.replaceSelection(`![${selection}](${url})`);
      offset = 2;
    } else {
      cm.replaceSelection(`[${selection}](${url})`);
      offset = 1;
    }

    cm.setSelection(
      {
        ch: startPoint.ch + offset,
        line: startPoint.line,
      },
      {
        ch: startPoint.ch + offset + selection.length,
        line: startPoint.line,
      }
    );
    cm.focus();
  }

  addImage = async () => {
    const { showAddImageDialog } = this.props;

    const data = await showAddImageDialog();

    debugger;

    this._onAddImageClose(data);
  };

  drawVideo = async () => {
    const url = await DialogManager.prompt(`${tt('editor_toolbar.enter_the_link')}:`);

    if (url) {
      this._cm.replaceSelection(this._processVideoUrl(url));
      this._cm.focus();
    }
  };

  _processVideoUrl(url) {
    // Parse https://vimeo.com/channels/staffpicks/273652603
    const match = url.match(/^(?:https?:\/\/)?vimeo\.com\/[a-z0-9]+\/[a-z0-9]+\/(\d+.*)$/);

    if (match) {
      return `https://vimeo.com/${match[1]}`;
    }

    return url;
  }

  onHeadingClick = () => {
    const cm = this._cm;

    const cursor = cm.getCursor();
    const text = cm.getLine(cursor.line);

    const match = text.match(/^(#+)(\s*)/);

    if (match) {
      const count = match[1].length;

      if (count >= MAX_HEADING) {
        cm.setSelection(
          {
            ch: 0,
            line: cursor.line,
          },
          {
            ch: count + match[2].length,
            line: cursor.line,
          }
        );

        cm.replaceSelection('');
        cm.setCursor({
          ch: 0,
          line: cursor.line,
        });
      } else {
        cm.setCursor({
          ch: 0,
          line: cursor.line,
        });
        cm.replaceSelection('#');

        cm.setCursor({
          ch: 1 + count + match[2].length,
          line: cursor.line,
        });
      }
    } else {
      cm.setCursor({
        ch: 0,
        line: cursor.line,
      });
      cm.replaceSelection('# ');
    }

    cm.focus();
  };

  onToggleOrderedList = () => {
    // this.props.SM.toggleOrderedList(this._editor);
    // return;
    const cm = this._cm;

    const cursor = cm.getCursor('start');
    const cursorEnd = cm.getCursor('end');
    const selection = cm.getSelection();

    if (!selection.trim()) {
      cm.replaceSelection('1. ');
      cm.setCursor({
        ch: 2,
        line: cursor.line,
      });
      return;
    }

    cm.setSelection(
      {
        ch: 0,
        line: cursor.line,
      },
      {
        ch: cursorEnd.ch,
        line: cursorEnd.line,
      }
    );

    let selectionLines = cm.getSelection().split('\n');

    if (/^\d+\. /.test(selectionLines[0])) {
      selectionLines = selectionLines.map(line => line.replace(/^\d+\.\s+/, ''));
    } else {
      selectionLines = selectionLines.map((line, i) => `${i + 1}. ${line}`);
    }

    cm.replaceSelection(selectionLines.join('\n'));
    cm.setSelection(
      {
        ch: 0,
        line: cursor.line,
      },
      {
        ch: 99999,
        line: cursorEnd.line,
      }
    );
  };

  _onAddImageClose = async data => {
    this.setState({
      newLineOpen: false,
      selected: null,
    });

    if (!data) {
      return;
    }

    let url;

    if (data.url) {
      url = data.url;
    } else if (data.file) {
      try {
        url = await uploadImage(data.file);
      } catch (err) {
        console.error(err);
        ToastsManager.error('Image uploading failed:', err.message);
        return;
      }
    }

    this._insertLink(url, true);
  };

  _onGlobalKeyDown = e => {
    if (this.state.toolbarShow && e.which === KEYS.ESCAPE) {
      this.setState({
        toolbarShow: false,
      });
    }
  };

  _onGlobalMouseDown = e => {
    const { target } = e;

    if (!target.closest('.MarkdownEditor')) {
      this.setState({
        newLineHelper: null,
      });
    }
  };

  _onMouseDown = () => {
    this._newLineHelperActivation = Date.now();
  };

  _onBlur = () => {
    if (!this._newLineHelperActivation || Date.now() > this._newLineHelperActivation + 500) {
      this.setState({
        newLineHelper: null,
      });
    }
  };
}
