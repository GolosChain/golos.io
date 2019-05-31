import React, { Component, createRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import cn from 'classnames';
import tt from 'counterpart';

import { displayError } from 'utils/toastMessages';

import DialogManager from 'components/elements/common/DialogManager';
import Icon from 'components/elements/Icon';
import MarkdownEditor from 'components/elements/postEditor/MarkdownEditor/MarkdownEditor';
import CommentFooter from 'components/elements/postEditor/CommentFooter';
import PreviewButton from 'components/elements/postEditor/PreviewButton';
import MarkdownViewer, { getRemarkable } from 'components/cards/MarkdownViewer/MarkdownViewer';
import { checkPostHtml } from 'utils/validator';
import { getTags } from 'utils/bodyProcessing/htmlReady';
import CommentAuthor from 'components/cards/CommentAuthor';

import {
  PreviewButtonWrapper,
  ReplyHeader,
  CommentFooterWrapper,
  CommentLoader,
  WorkArea,
} from './CommentFormStyled';
import './CommentForm.scss';

const DRAFT_KEY = 'golos.comment.draft';

export default class CommentForm extends Component {
  static propTypes = {
    reply: PropTypes.bool,
    editMode: PropTypes.bool,
    commentInputFocused: PropTypes.bool,
    params: PropTypes.shape({}).isRequired,
    parentPost: PropTypes.shape({}),
    jsonMetadata: PropTypes.shape({}),
    autoFocus: PropTypes.bool,
    clearAfterAction: PropTypes.bool,
    withHeader: PropTypes.bool,
    hideFooter: PropTypes.bool,
    replyAuthor: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]),
    commentTitleRef: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.element]),

    createComment: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    fetchPost: PropTypes.func.isRequired,
    fetchPostComments: PropTypes.func.isRequired,
    uploadImage: PropTypes.func,
    onSuccess: PropTypes.func,
    onCancel: PropTypes.func,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    commentInputFocused: false,
    reply: false,
    editMode: false,
    jsonMetadata: {},
    autoFocus: false,
    clearAfterAction: false,
    withHeader: false,
    hideFooter: false,
    commentTitleRef: null,
    replyAuthor: null,
    parentPost: null,

    uploadImage: () => {},
    onSuccess: () => {},
    onCancel: () => {},
    onChange: () => {},
  };

  editorRef = createRef();

  constructor(props) {
    super(props);

    const { editMode, reply, params } = this.props;

    this.state = {
      text: reply ? `@${params.contentId.userId} ` : '',
      emptyBody: true,
      uploadingCount: 0,
      isPosting: false,
    };

    let isLoaded = false;

    try {
      isLoaded = this.tryLoadDraft();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[Golos.io] Draft recovering failed:', err);
    }

    if (!isLoaded && editMode) {
      this.fillFromMetadata();
    }
  }

  componentDidMount() {
    const { autoFocus, forwardRef } = this.props;
    if (window.location.hash === '#createComment') {
      this.setFocus();
      this.onInputFocused();
    } else if (autoFocus) {
      this.setFocus();
    }

    if (forwardRef) {
      forwardRef.current = this;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { commentInputFocused } = this.props;
    if (!commentInputFocused && nextProps.commentInputFocused) {
      this.setFocus();
    }
  }

  componentWillUnmount() {
    const { forwardRef } = this.props;
    this.unmount = true;

    if (forwardRef) {
      forwardRef.current = null;
    }

    this.saveDraftLazy.cancel();
    this.checkBodyLazy.cancel();
  }

  setFocus() {
    let iterationsCount = 0;
    if (this.editorRef.current) {
      const intervalId = setInterval(() => {
        this.editorRef.current.focus();
        // eslint-disable-next-line
        if (++iterationsCount === 3) {
          clearInterval(intervalId);
        }
      }, 50);
    }
  }

  getPreviewButton = () => {
    const { commentTitleRef, withHeader } = this.props;
    const { emptyBody, isPreview } = this.state;
    const previewButton = (
      // eslint-disable-next-line
      <PreviewButton isStatic isPreview={isPreview} onPreviewChange={this.onPreviewChange} />
    );
    if (commentTitleRef) {
      return createPortal(
        <PreviewButtonWrapper emptyBody={emptyBody} isStatic>
          {previewButton}
        </PreviewButtonWrapper>,
        commentTitleRef
      );
    }

    if (withHeader) {
      return (
        <PreviewButtonWrapper emptyBody={emptyBody} isStatic>
          {previewButton}
        </PreviewButtonWrapper>
      );
    }

    return <PreviewButtonWrapper emptyBody={emptyBody}>{previewButton}</PreviewButtonWrapper>;
  };

  onPreviewChange = enable => {
    if (enable) {
      this.saveDraft();

      this.setState({
        isPreview: true,
        text: this.editorRef.current.getValue(),
      });
    } else {
      this.setState({
        isPreview: false,
      });
    }
  };

  onUploadImage = (file, progress) => {
    const { uploadingCount } = this.state;
    const { uploadImage } = this.props;
    this.setState(
      {
        uploadingCount: uploadingCount + 1,
      },
      () => {
        uploadImage({
          file,
          progress: data => {
            if (!this.unmount) {
              if (data && (data.url || data.error)) {
                this.setState({
                  uploadingCount: uploadingCount - 1,
                });
              }

              progress(data);
            }
          },
        });
      }
    );
  };

  onCancelClick = async () => {
    const body = this.editorRef.current.getValue();

    if (
      !body ||
      !body.trim() ||
      (await DialogManager.confirm(tt('comment_editor.cancel_comment')))
    ) {
      const { onCancel, clearAfterAction } = this.props;
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }

      onCancel();
      if (clearAfterAction) {
        this.editorRef.current.setValue('');
      }
    }
  };

  post = () => {
    const body = this.editorRef.current.getValue();
    const html = getRemarkable().render(body);

    if (!body || !body.trim()) {
      displayError(tt('g.error'), { message: tt('post_editor.empty_body_error') });
      return;
    }

    const rTags = getTags(html);
    const error = checkPostHtml(rTags);

    if (error) {
      displayError(tt('g.error'), { message: error.text });
      return;
    }

    // this.props.loginIfNeed(logged => {
    //   if (!logged) {
    //     return;
    //   }

    this.publish({ rTags, body });
    // });
  };

  saveDraft = () => {
    const { editMode, params } = this.props;

    const body = this.editorRef.current.getValue();

    this.setState({
      text: body,
    });

    try {
      const save = {
        editMode,
        permLink: params.contentId.permlink,
        text: body,
      };

      const json = JSON.stringify(save);

      localStorage.setItem(DRAFT_KEY, json);
    } catch (err) {
      // eslint-disable-next-line
      console.warn('[Golos.io] Draft not saved:', err);
    }
  };

  onTextChangeNotify = () => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(this.editorRef.current.getValue());
    }
    this.saveDraftLazy();
    this.checkBodyLazy();
  };

  onInputBlured = () => {
    // const { toggleCommentInputFocus } = this.props;
    // toggleCommentInputFocus(false);
  };

  onInputFocused = () => {
    // const { toggleCommentInputFocus } = this.props;
    // toggleCommentInputFocus(true);
  };

  handleSubmit = async data => {
    const {
      editMode,
      reply,
      parentPost,
      clearAfterAction,
      params,
      createComment,
      updateComment,
      waitForTransaction,
      fetchPost,
      fetchPostComments,
      onSuccess,
    } = this.props;

    try {
      localStorage.removeItem(DRAFT_KEY);

      let result;

      if (editMode) {
        result = await updateComment(data);
      } else {
        result = await createComment(data);
      }

      await waitForTransaction(result.transaction_id);

      let postContentId = params.contentId;

      if ((reply || editMode) && parentPost) {
        postContentId = parentPost;
      }

      await Promise.all([
        fetchPost(postContentId),
        fetchPostComments({ contentId: postContentId }),
      ]);

      if (!this.unmount) {
        if (clearAfterAction) {
          this.editorRef.current.setValue('');
        }
      }

      onSuccess();
    } catch (err) {
      if (!this.unmount && err !== 'Canceled') {
        displayError(tt('g.error'), { message: err.toString().trim() });
      }
    }
    if (!this.unmount) {
      this.setState({
        isPosting: false,
      });
    }
  };

  checkIsPostDisabled() {
    const { isPosting, uploadingCount, emptyBody } = this.state;

    const allowPost = uploadingCount === 0 && !emptyBody;
    return isPosting || !allowPost;
  }

  checkBody() {
    const editor = this.editorRef.current;

    if (editor) {
      const value = editor.getValue();

      this.setState({
        emptyBody: value.trim().length === 0,
      });
    }
  }

  tryLoadDraft() {
    const { editMode, params, onChange } = this.props;

    const json = localStorage.getItem(DRAFT_KEY);

    if (json) {
      const draft = JSON.parse(json);

      if (draft.editMode !== editMode || draft.permLink !== params.contentId.permlink) {
        return;
      }

      const { state } = this;

      state.text = draft.text;
      state.emptyBody = draft.text.trim().length === 0;
      onChange(draft.text);
      // eslint-disable-next-line
      return true;
    }
  }

  fillFromMetadata() {
    const { params } = this.props;
    this.state.text = params.content ? params.content.body.full : '';
    this.state.emptyBody = false;
  }

  cancel() {
    this.onCancelClick();
  }

  // eslint-disable-next-line class-methods-use-this
  safeWrapper(callback) {
    return (...args) => {
      try {
        return callback(...args);
      } catch (err) {
        displayError(tt('g.error'));
        return null;
      }
    };
  }

  publish({ rTags, body }) {
    const { params } = this.props;
    const metadata = params.content && params.content.metadata ? params.content.metadata : null;

    const meta = {
      app: 'golos.io',
      format: 'markdown',
      tags: [],
    };

    if (metadata && metadata.tags) {
      meta.tags = metadata.tags;
    }

    // if (metadata && metadata.category && meta.tags[0] !== metadata.category) {
    //   meta.tags.unshift(metadata.category);
    // }

    if (rTags.usertags.length) {
      meta.users = rTags.usertags;
    }

    if (rTags.images.length) {
      meta.image = Array.from(rTags.images);
    }

    if (rTags.links.length) {
      meta.links = Array.from(rTags.links);
    }

    const data = {
      contentId: params.contentId,
      body,
      jsonmetadata: meta,
    };

    this.setState({
      isPosting: true,
    });

    this.handleSubmit(data);
  }

  // eslint-disable-next-line
  postSafe = this.safeWrapper(this.post);

  saveDraftLazy = throttle(this.saveDraft, 300, {
    leading: false,
  });

  checkBodyLazy = throttle(this.checkBody, 300, { leading: true });

  render() {
    const { editMode, hideFooter, autoFocus, withHeader, replyAuthor } = this.props;

    const { text, isPreview, uploadingCount, isPosting } = this.state;

    return (
      <>
        {withHeader && (
          <ReplyHeader>
            <CommentAuthor author={replyAuthor} />
            {this.getPreviewButton()}
          </ReplyHeader>
        )}
        <div
          className={cn('CommentForm', {
            CommentForm_edit: editMode,
          })}
        >
          <WorkArea>
            {withHeader ? null : this.getPreviewButton()}
            {isPreview ? (
              <div className="CommentForm__preview">
                <MarkdownViewer text={text} />
              </div>
            ) : null}
            <div
              className={cn('CommentForm__content', {
                CommentForm__content_hidden: isPreview,
              })}
            >
              <MarkdownEditor
                ref={this.editorRef}
                autoFocus={autoFocus}
                commentMode
                initialValue={text}
                placeholder={tt('g.reply')}
                uploadImage={this.onUploadImage}
                onChangeNotify={this.onTextChangeNotify}
                onInputBlured={this.onInputBlured}
              />
            </div>
          </WorkArea>
          {hideFooter ? null : (
            <CommentFooterWrapper>
              <CommentFooter
                editMode={editMode}
                postDisabled={!allowPost || isPosting}
                onPostClick={this.postSafe}
                onCancelClick={this.onCancelClick}
              />
            </CommentFooterWrapper>
          )}
          {uploadingCount > 0 ? (
            <CommentLoader>
              <Icon name="clock" size="4x" className="CommentForm__spinner-inner" />
            </CommentLoader>
          ) : null}
        </div>
      </>
    );
  }
}
