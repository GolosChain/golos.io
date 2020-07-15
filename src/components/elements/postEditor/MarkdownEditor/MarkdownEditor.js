import React, { PureComponent, createRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import is from 'styled-is';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import ReactDropZone from 'react-dropzone';
import tt from 'counterpart';
import cn from 'classnames';

import { ALLOWED_IMAGE_TYPES, imgProxyPrefix } from 'constants/config';
import { validateAndUpload } from 'utils/uploadImages';
import MarkdownEditorToolbar from 'components/elements/postEditor/MarkdownEditorToolbar';

const DELAYED_TIMEOUT = 1000;
const LINE_HEIGHT = 28;
let SimpleMDE;

if (process.browser) {
  SimpleMDE = require('codemirror-md');
}

let lastWidgetId = 0;

const Wrapper = styled.div`
  ${is('isDisabled')`
    pointer-events: none;
    cursor: not-allowerd;
  `}
`;

const PanelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  width: 100vw;
  max-width: 100vw;
  position: sticky;
  bottom: 0;
  padding: 0;
  background-color: #fff;
  overflow: auto;

  @media (min-width: 860px) {
    display: none;
  }

  @media (max-width: 360px) {
    ${is('isEdit')`
      width: 100vw;
      max-width: 100vw;
    `};
  }

  ${is('isEdit')`
    width: 100%;
    max-width: 100%;
  `};
`;

export default class MarkdownEditor extends PureComponent {
  static propTypes = {
    initialValue: PropTypes.string,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    scrollContainer: PropTypes.any,
    commentMode: PropTypes.bool,
    onChangeNotify: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    onInputBlured: PropTypes.func,
    isDisabled: PropTypes.bool,
  };

  textAreaRef = createRef();

  constructor(props) {
    super(props);

    this.processTextLazy = throttle(this.processText, 100, {
      leading: false,
    });
    this.onCursorActivityLazy = debounce(this.onCursorActivity, 50);
  }

  componentDidMount() {
    if (window.INIT_TIMESSTAMP) {
      const timeDelta = DELAYED_TIMEOUT - (Date.now() - window.INIT_TIMESSTAMP);

      if (timeDelta > 0) {
        this._delayedTimeout = setTimeout(() => this.init(), timeDelta);
        return;
      }
    }

    this.init();
  }

  init() {
    const { props } = this;

    this.simplemde = new SimpleMDE({
      status: false,
      autofocus: props.autoFocus,
      placeholder: props.placeholder,
      initialValue: props.initialValue || '',
      element: this.textAreaRef.current,
      promptURLs: true,
      dragDrop: true,
      toolbar: false,
      toolbarTips: false,
      autoDownloadFontAwesome: false,
      spellCheck: true,
      blockStyles: {
        italic: '_',
      },
    });

    this.lineWidgets = [];

    this.cm = this.simplemde.codemirror;
    this.cm.on('change', this.onChange);
    this.cm.on('paste', this.onPaste);
    this.cm.on('blur', this.onBlur);

    if (props.scrollContainer) {
      this.cm.on('cursorActivity', this.onCursorActivityLazy);
    }

    if (this.props.autoFocus) {
      this.cm.setCursor({ line: 999, ch: 999 });
    }

    this.forceUpdate();

    // DEV: For experiments
    if (process.env.NODE_ENV !== 'production') {
      window.SM = SimpleMDE;
      window.sm = this.simplemde;
      window.cm = this.cm;
    }

    this.isIos = /ios/i.test(navigator.userAgent);

    this._previewTimeout = setTimeout(() => {
      this.processText();
    }, 500);
  }

  componentWillUnmount() {
    clearTimeout(this._previewTimeout);
    clearTimeout(this._delayedTimeout);

    this.processTextLazy.cancel();
    this.onCursorActivityLazy.cancel();

    if (this.cm) {
      this.cm.off('change', this.onChange);
      this.cm.off('paste', this.onPaste);
      this.cm.off('blur', this.onBlur);
      this.cm.off('cursorActivity', this.onCursorActivityLazy);
      this.cm = null;
    }

    this.simplemde = null;
  }

  render() {
    const { uploadImage, commentMode, wrapperRef, editMode, isDisabled } = this.props;
    return (
      <Wrapper
        isDisabled={isDisabled}
        className={cn('MarkdownEditor', {
          MarkdownEditor_comment: commentMode,
        })}
      >
        <ReactDropZone multiple={false} accept={ALLOWED_IMAGE_TYPES} noClick onDrop={this.onDrop}>
          {({ getRootProps, getInputProps }) => (
            <div className="MarkdownEditor__dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
              {this.simplemde ? (
                <MarkdownEditorToolbar
                  commentMode={commentMode}
                  editor={this.simplemde}
                  uploadImage={uploadImage}
                  SM={SimpleMDE}
                />
              ) : null}
              <textarea ref={this.textAreaRef} className="MarkdownEditor__textarea" />
            </div>
          )}
        </ReactDropZone>

        {wrapperRef && wrapperRef.current && this.simplemde
          ? createPortal(
              <PanelWrapper isEdit={editMode}>
                <MarkdownEditorToolbar
                  commentMode
                  editor={this.simplemde}
                  uploadImage={uploadImage}
                  SM={SimpleMDE}
                  mobile
                />
              </PanelWrapper>,
              wrapperRef.current
            )
          : null}
      </Wrapper>
    );
  }

  focus() {
    this.cm.focus();
  }

  isFocused() {
    return this.cm.hasFocus();
  }

  getValue() {
    return this.simplemde.value();
  }

  setValue(value) {
    this.simplemde.value(value);
  }

  onBlur = () => {
    if (this.props.onInputBlured) {
      this.props.onInputBlured();
    }
  };

  onChange = (instance, change) => {
    /**
     * Это костыль который чинит проблему залипания caps-lock на ios
     * Баг репорты:
     * - https://github.com/ProseMirror/prosemirror/issues/25
     * - https://github.com/codemirror/CodeMirror/issues/3403
     */
    if (this.isIos) {
      try {
        if (change.text.length === 1) {
          const text = change.text[0];

          if (text.length === 1) {
            // Если была введена заглавная буква
            if (text !== text.toLowerCase() && document.activeElement) {
              const focused = document.activeElement;

              focused.blur();
              focused.focus();
            }
          }
        }
      } catch (err) {}
    }

    this.props.onChangeNotify();
    this.processTextLazy();
  };

  onDrop = async (files, _, e) => {
    const file = files[0];

    const cursorPosition = this.cm.coordsChar({
      left: e.pageX,
      top: e.pageY,
    });

    const url = await validateAndUpload(file);

    if (url) {
      this.cm.replaceRange(`![${file.name}](${url})`, cursorPosition);
    }
  };

  processText = () => {
    this.cutIframes();
    this.processImagesPreview();
  };

  processImagesPreview() {
    const { cm } = this;
    const alreadyWidgets = new Set();

    for (const widget of this.lineWidgets) {
      alreadyWidgets.add(widget);
    }

    for (let line = 0, last = cm.lineCount(); line < last; line++) {
      const lineContent = cm.getLine(line);

      let match;

      match = lineContent.match(/!\[[^\]]*\]\(([^)]+)\)/);

      if (!match) {
        match = lineContent.match(
          /(?:^|\s)((?:https?:)?\/\/[^\s]+\.[^\s]+\.(?:jpe?g|png|gif))(?:\s|$)/
        );
      }

      if (match) {
        let url = match[1];

        if (!url.startsWith('http')) {
          url = `http:${url}`;
        }

        if (this.addLineWidget(alreadyWidgets, line, url)) {
          continue;
        }
      }

      match =
        lineContent.match(
          /(?:^|\s)(?:https?:)?\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})(?:\s|&|$)/
        ) || lineContent.match(/(?:^|\s)(?:https?:)?\/\/youtu\.be\/([A-Za-z0-9_-]{11})(?:\s|&|$)/);

      if (match) {
        this.addLineWidget(alreadyWidgets, line, `https://img.youtube.com/vi/${match[1]}/0.jpg`);
      }
    }

    this.lineWidgets = this.lineWidgets.filter(widget => !alreadyWidgets.has(widget));

    for (const widget of alreadyWidgets) {
      widget.clear();
    }
  }

  cutIframes() {
    const text = this.simplemde.value();

    let updated = false;

    const updatedText = text.replace(/<iframe\s+([^>]*)>[\s\S]*<\/iframe>/g, (a, attrsStr) => {
      const match = attrsStr.match(/src="([^"]+)"/);

      if (match) {
        let match2 = match[1].match(/^https:\/\/www\.youtube\.com\/embed\/([A-Za-z0-9_-]+)/);

        if (match2) {
          updated = true;
          return `https://youtube.com/watch?v=${match2[1]}`;
        }

        match2 = match[1].match(/^(?:https?:)?\/\/rutube\.ru\/play\/embed\/([A-Za-z0-9_-]+)/);

        if (match2) {
          updated = true;
          return `https://rutube.ru/video/${match2[1]}/`;
        }

        match2 = match[1].match(/^(?:https?:)?\/\/ok\.ru\/videoembed\/([A-Za-z0-9_-]+)/);

        if (match2) {
          updated = true;
          return `https://ok.ru/video/${match2[1]}`;
        }
      }
    });

    if (updated) {
      for (const w of this.lineWidgets) {
        w.clear();
      }

      this.lineWidgets = [];

      const cursor = this.cm.getCursor();
      this.simplemde.value(updatedText);

      setTimeout(() => {
        this.cm.setCursor(cursor);
      }, 0);
    }
  }

  addLineWidget(alreadyWidgets, line, url) {
    for (const widget of this.lineWidgets) {
      if (widget.line.lineNo() === line) {
        if (widget.url === url) {
          alreadyWidgets.delete(widget);
          return;
        }
      }
    }

    const img = new Image();
    img.classList.add('MarkdownEditor__preview');

    img.addEventListener('load', () => {
      const widget = this.cm.addLineWidget(line, img, {
        handleMouseEvents: true,
      });
      widget.id = ++lastWidgetId;
      widget.url = url;
      this.lineWidgets.push(widget);
    });

    img.addEventListener('error', () => {
      const div = document.createElement('div');
      div.classList.add('MarkdownEditor__preview-error');
      div.innerText = tt('post_editor.image_preview_error');
      const widget = this.cm.addLineWidget(line, div, {
        handleMouseEvents: true,
      });
      widget.id = ++lastWidgetId;
      widget.url = url;
      this.lineWidgets.push(widget);
    });

    img.src = `${imgProxyPrefix}/${url}`;
  }

  onPaste = async (cm, e) => {
    if (!e.clipboardData) {
      return;
    }

    try {
      let fileName = null;

      for (const item of e.clipboardData.items) {
        if (item.kind === 'string' && item.type === 'text/plain') {
          try {
            item.getAsString(text => {
              if (text) {
                const match = text.match(/[^\\\/]+$/);

                if (match) {
                  fileName = match[0];
                }
              }
            });
          } catch (err) {}
        }

        if (item.kind === 'file') {
          e.preventDefault();
          const file = item.getAsFile();
          const url = await validateAndUpload(file);

          if (url) {
            this.cm.replaceSelection(`![${fileName || file.name}](${url})`);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('Error analyzing clipboard event', err);
    }
  };

  // _tryToFixCursorPosition() {
  //     // Hack: Need some action for fix cursor position
  //     if (this.props.initialValue) {
  //         this.cm.execCommand('selectAll');
  //         this.cm.execCommand('undoSelection');
  //     } else {
  //         this.cm.execCommand('goLineEnd');
  //         this.cm.replaceSelection(' ');
  //         this.cm.execCommand('delCharBefore');
  //     }
  // }

  onCursorActivity = () => {
    const { scrollContainer } = this.props;

    if (scrollContainer) {
      const cursorPos = this.cm.cursorCoords();

      if (
        cursorPos.top + LINE_HEIGHT + 4 >
        scrollContainer.offsetTop + scrollContainer.offsetHeight
      ) {
        scrollContainer.scrollTop += LINE_HEIGHT;
      }
    }
  };
}
