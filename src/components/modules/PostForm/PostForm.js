/* eslint-disable consistent-return, no-undef, no-underscore-dangle, camelcase, no-console */
import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash.throttle';
import Turndown from 'turndown';
import tt from 'counterpart';
import getSlug from 'speakingurl';

import { Router } from 'shared/routes';

import htmlReady, { getTags } from 'utils/bodyProcessing/htmlReady';
import DialogManager from 'components/elements/common/DialogManager';
import Icon from 'components/golos-ui/Icon';
import MarkdownEditor from 'components/elements/postEditor/MarkdownEditor';
import HtmlEditor from 'components/elements/postEditor/HtmlEditor';
import EditorSwitcher from 'components/elements/postEditor/EditorSwitcher';
import PostFooter from 'components/elements/postEditor/PostFooter';
import PostTitle from 'components/elements/postEditor/PostTitle';
import PreviewButton from 'components/elements/postEditor/PreviewButton';
import MarkdownViewer, { getRemarkable } from 'components/cards/MarkdownViewer';
import { checkPostHtml } from 'utils/validator';
import { processTagsFromData, validateTags, updateFavoriteTags } from 'utils/tags';
import { wait } from 'utils/time';
import { DRAFT_KEY, EDIT_KEY } from 'utils/postForm';
import { displayError } from 'utils/toastMessages';
import { normalizeCyberwayErrorMessage } from 'utils/errors';
import { breakWordStyles } from 'helpers/styles';

const EDITORS_TYPES = {
  MARKDOWN: 1,
  MARKDOWN_OLD: 2,
  HTML: 3,
};

export const PAYOUT_TYPES = {
  PAY_0: 1,
  PAY_50: 2,
  PAY_100: 3,
};

const DEFAULT_CURATION_PERCENT = 5000; // 50%

export const PAYOUT_OPTIONS = [
  {
    id: PAYOUT_TYPES.PAY_100,
    title: 'post_editor.payout_option_100',
    hint: 'post_editor.payout_option_100_hint',
  },
  {
    id: PAYOUT_TYPES.PAY_50,
    title: 'post_editor.payout_option_50',
    hint: 'post_editor.payout_option_50_hint',
  },
  {
    id: PAYOUT_TYPES.PAY_0,
    title: 'post_editor.payout_option_0',
    hint: 'post_editor.payout_option_0_hint',
  },
];

function markdownToHtmlEditorState(markdown) {
  let html;

  if (markdown && markdown.trim() !== '') {
    html = getRemarkable().render(markdown);
    html = htmlReady(html);
  }

  return HtmlEditor.getStateFromHtml(html);
}

function slug(text) {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

const Preview = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const PreviewHeader = styled.h1`
  font-weight: 700;
  font-size: 200%;
  ${breakWordStyles};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  @media (min-width: 861px) {
    min-height: calc(100vh - 60px);

    ${is('isEdit')`
      min-height: 100%;
    `};
  }
`;

const WorkArea = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  min-height: 400px;
  height: calc(100% - 80px);
  padding-top: 10px;
  overflow-y: auto;

  ${is('isEdit')`
    padding: 10px 70px 0;
  `};

  @media (max-width: 576px) {
    ${is('isEdit')`
      padding: 10px 20px 0;
    `};
  }
`;

const Content = styled.div`
  max-width: 700px;
  padding: 0 8px;
  margin: 0 auto;

  @media (max-width: 860px) {
    overflow-x: hidden;
    max-width: 100%;
  }
`;

const Footer = styled.div`
  width: 100%;
  flex-shrink: 0;
  z-index: 1;
  user-select: none;
  background: #fff;
  box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.07);
  margin-top: 10px;

  ${is('isEdit')`
    box-shadow: none;
  `};
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 75rem;
  padding: 0 8px;
  margin: 0 auto;

  @media (max-width: 860px) {
    max-width: 100%;
    padding: 0;
    overflow: hidden;
  }
`;

const SpinnerContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  animation: fade-in 1s forwards;
  animation-delay: 0.3s;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  padding: 40px 60px;
  border-radius: 18px;
  color: #999;
  background: rgba(0, 0, 0, 0.1);
`;

const EditorSwitcherWrapper = styled.div`
  @media (max-width: 860px) {
    display: none;
  }
`;

export default class PostForm extends React.Component {
  static propTypes = {
    editMode: PropTypes.bool,
    curationPercent: PropTypes.number,
    post: PropTypes.shape({}),
    permLink: PropTypes.string,
    payoutType: PropTypes.number,
    mobileButtonsWrapperRef: PropTypes.shape({}),
    minCurationPercent: PropTypes.number,
    maxCurationPercent: PropTypes.number,
    selfVote: PropTypes.bool,

    onCancel: PropTypes.func.isRequired,
    fetchChainProperties: PropTypes.func.isRequired,
    waitForTransaction: PropTypes.func.isRequired,
    createPost: PropTypes.func.isRequired,
    fetchPost: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    vote: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    editMode: false,
    permLink: '',
    payoutType: 0,
    post: null,
    curationPercent: 50,
    mobileButtonsWrapperRef: {},
    minCurationPercent: 0,
    maxCurationPercent: 95,
    selfVote: false,
  };

  previewButton = createRef();

  workAreaRef = createRef();

  editorWrapper = createRef();

  postTitle = createRef();

  editorRef = createRef();

  footerRef = createRef();

  constructor(props) {
    super(props);

    const { editMode } = this.props;

    this.state = {
      isPreview: false,
      editorId: EDITORS_TYPES.MARKDOWN,
      title: '',
      text: '',
      emptyBody: true,
      rteState: null,
      tags: [],
      payoutType: PAYOUT_TYPES.PAY_50,
      curationPercent: DEFAULT_CURATION_PERCENT,
      isPosting: false,
      uploadingCount: 0,
      isPreviewButtonVisible: true,
    };

    this._saveDraftLazy = throttle(this._saveDraft, 500, {
      leading: true,
    });
    this.checkBodyLazy = throttle(this.checkBody, 300, {
      leading: false,
    });
    this.postSafe = this.safeWrapper(this.post);

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
    const { editMode, fetchChainProperties } = this.props;

    window.addEventListener('scroll', this.checkPreviewButtonPosition);

    if (!editMode) {
      fetchChainProperties();
    }
  }

  componentWillUnmount() {
    this._unmount = true;
    this._saveDraftLazy.cancel();
    this.checkBodyLazy.cancel();

    window.removeEventListener('scroll', this.checkPreviewButtonPosition);
  }

  onEditorChange = async toEditorId => {
    const { editorId } = this.state;
    let newText = null;
    let newRteState = null;

    if (editorId === EDITORS_TYPES.HTML) {
      if (this.editorRef.current.isEmpty()) {
        newText = '';
        newRteState = null;
      } else {
        if (!(await DialogManager.dangerConfirm(tt('post_editor.convert_to_md_warning')))) {
          return;
        }

        const td = new Turndown({
          headingStyle: 'atx',
        });

        newText = td.turndown(this.editorRef.current.getValue());

        newText = newText.replace(
          /~~~ embed:([A-Za-z0-9_]+) (youtube|vimeo|coub) ~~~/g,
          (a, code, hosting) => {
            if (hosting === 'youtube') {
              return `https://youtube.com/watch?v=${code}`;
            }
            if (hosting === 'coub') {
              return `https://coub.com/view/${code}`;
            }
            return `https://vimeo.com/${code}`;
          }
        );

        newRteState = null;
      }
    } else if (editorId === EDITORS_TYPES.MARKDOWN) {
      const body = this.editorRef.current.getValue();

      if (body.trim()) {
        if (!(await DialogManager.dangerConfirm(tt('post_editor.convert_to_html_warning')))) {
          return;
        }
      }

      newText = null;
      newRteState = markdownToHtmlEditorState(body);
    }

    this.setState(
      {
        editorId: toEditorId,
        text: newText,
        rteState: newRteState,
        isPreview: false,
      },
      this._saveDraftLazy
    );
  };

  onPreviewChange = enable => {
    if (enable) {
      this._saveDraft();

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

  onTitleChange = title => {
    this.setState(
      {
        title,
      },
      this._saveDraftLazy
    );
  };

  onTitleTab = () => {
    try {
      this.editorRef.current.focus();
    } catch (err) {
      console.warn(err);
    }
  };

  _onHtmlEditorChange = state => {
    this.setState(
      {
        rteState: state,
      },
      this._onTextChangeNotify
    );
  };

  _onTextChangeNotify = () => {
    this._saveDraftLazy();
    this.checkBodyLazy();
  };

  _onTagsChange = tags => {
    this.setState(
      {
        tags,
      },
      this._saveDraftLazy
    );
  };

  _onCurationPercentChange = percent => {
    this.setState({ curationPercent: percent }, this._saveDraftLazy);
  };

  _onPayoutTypeChange = payoutType => {
    this.setState({ payoutType }, this._saveDraftLazy);
  };

  onCancelClick = async () => {
    const { onCancel } = this.props;
    if (await DialogManager.confirm(tt('g.are_you_sure'))) {
      try {
        sessionStorage.removeItem(EDIT_KEY);
      } catch (err) {
        console.warn(err);
      }

      onCancel();
    }
  };

  onUploadImage = (file, progress) => {
    const { uploadImage } = this.props;
    this.setState(
      prevState => ({
        uploadingCount: prevState.uploadingCount + 1,
      }),
      () => {
        uploadImage({
          file,
          progress: data => {
            if (!this._unmount) {
              if (data && (data.url || data.error)) {
                this.setState(prevState => ({
                  uploadingCount: prevState.uploadingCount - 1,
                }));
              }

              progress(data);
            }
          },
        });
      }
    );
  };

  onResetClick = () => {
    const { editorId } = this.state;
    let rteState = null;

    if (editorId === EDITORS_TYPES.MARKDOWN) {
      if (this.editorRef.current) {
        this.editorRef.current.setValue('');
      }
    } else {
      rteState = HtmlEditor.getStateFromHtml('');
    }

    this.postTitle.current.reset();

    this.setState({
      title: '',
      text: '',
      rteState,
      tags: [],
      isPreview: false,
    });

    localStorage.removeItem(DRAFT_KEY);
  };

  handleSubmit = async data => {
    const {
      editMode,
      createPost,
      fetchPost,
      updatePost,
      post,
      selfVote,
      vote,
      waitForTransaction,
    } = this.props;
    const { tags } = this.state;

    if (!data) {
      return;
    }

    try {
      if (editMode) {
        sessionStorage.removeItem(EDIT_KEY);
        const result = await updatePost({
          contentId: post.contentId,
          title: data.title,
          body: data.body,
          tags: data.tags,
          jsonmetadata: data.jsonmetadata,
        });

        await waitForTransaction(result.transaction_id);

        await fetchPost(post.contentId);

        Router.pushRoute('post', post.contentId);
      } else {
        let result;
        try {
          result = await createPost(data);
        } catch (err) {
          const message = normalizeCyberwayErrorMessage(err);

          if (message.includes('This message already exists')) {
            const permlink = slug(`${data.title}-${new Date().getTime()}`, { lower: true });
            try {
              await this.handleSubmit({
                ...data,
                permlink,
              });
            } catch (err) {
              throw err;
            }
            return;
          }

          throw err;
        }

        localStorage.removeItem(DRAFT_KEY);

        updateFavoriteTags(tags);

        try {
          await waitForTransaction(result.transaction_id);
        } catch (err) {
          displayError(tt('g.transaction_wait_failed'), err);
          // В случае ошибки ожидания транзакции немного ждем и всё равно пытаемся перейти на пост
          await wait(1000);
        }

        const { author } = result.processed.action_traces[0].act.data.message_id;

        if (selfVote) {
          const voteResult = await vote({
            contentId: {
              userId: author,
              permlink: data.permlink,
            },
            type: 'post',
            weight: 10000,
          });

          try {
            await waitForTransaction(voteResult.transaction_id);
          } catch (err) {
            displayError(tt('g.transaction_wait_failed'), err);
            // В случае ошибки ожидания транзакции немного ждем и всё равно пытаемся перейти на пост
            await wait(1000);
          }
        }

        Router.pushRoute('post', {
          userId: author,
          permlink: data.permlink,
        });
      }
    } catch (err) {
      displayError('Post submitting failed', err);
    }

    if (!this._unmount) {
      this.setState({
        isPosting: false,
      });
    }
  };

  validateTitle = title => {
    const _title = title.trim();

    if (/\*[\w\s]*\*|#[\w\s]*#|_[\w\s]*_|~[\w\s]*~|]\s*\(|]\s*\[/.test(_title)) {
      return tt('submit_a_story.markdown_not_supported');
    }
  };

  checkPreviewButtonPosition = () => {
    const { isPreviewButtonVisible } = this.state;
    const workArea = this.workAreaRef.current;
    const { current } = this.previewButton;

    const containerYBottom = workArea ? workArea.getBoundingClientRect().bottom : null;
    const previewButtonYTop = current ? current.getPreviewButtonPosition() : null;

    if (containerYBottom && previewButtonYTop) {
      if (containerYBottom < previewButtonYTop && isPreviewButtonVisible) {
        this.setState({
          isPreviewButtonVisible: false,
        });
      }
      if (containerYBottom >= previewButtonYTop && !isPreviewButtonVisible) {
        this.setState({
          isPreviewButtonVisible: true,
        });
      }
    }
  };

  post = () => {
    const { editMode } = this.props;
    const { title, tags, payoutType, curationPercent, editorId } = this.state;

    const footer = this.footerRef.current;

    if (!title.trim()) {
      footer.showPostError(tt('category_selector_jsx.title_is_required'));
      return;
    }

    if (this.validateTitle(title)) {
      footer.showPostError(tt('category_selector_jsx.title_is_not_valid'));
      return;
    }

    if (!tags.length) {
      footer.showPostError(tt('category_selector_jsx.must_set_category'));
      return;
    }

    const validateTagsError = validateTags(tags, true);

    if (validateTagsError) {
      footer.showPostError(validateTagsError);
      return;
    }

    const body = this.editorRef.current.getValue();
    let html;

    if (!body || !body.trim()) {
      footer.showPostError(tt('post_editor.empty_body_error'));
      return;
    }

    if (editorId === EDITORS_TYPES.MARKDOWN) {
      html = getRemarkable().render(body);
    } else if (editorId === EDITORS_TYPES.HTML) {
      html = body;
    }

    const rtags = getTags(html);

    if (editorId === EDITORS_TYPES.HTML) {
      rtags.htmltags.delete('html');
    }

    const checkPostHtmlError = checkPostHtml(rtags);

    if (checkPostHtmlError) {
      footer.showPostError(checkPostHtmlError.text);
      return;
    }

    const meta = {
      app: 'golos.io',
      format: editorId === EDITORS_TYPES.HTML ? 'html' : 'markdown',
      tags,
    };

    if (rtags.usertags.length) {
      meta.users = rtags.usertags;
    }

    if (rtags.images.length) {
      meta.image = Array.from(rtags.images);
    }

    if (rtags.links.length) {
      meta.links = Array.from(rtags.links);
    }

    const permlink = slug(title, { lower: true });

    const data = {
      permlink,
      title,
      body,
      parent_author: '',
      tags: Array.from(rtags.hashtags),
      jsonmetadata: meta,
      curationPercent,
    };

    // if (!editMode) {
    //   const { minCurationPercent, maxCurationPercent } = this.props;
    //
    //   const boundPercent = Math.min(
    //     Math.max(minCurationPercent, curationPercent),
    //     maxCurationPercent
    //   );
    //
    //   const commentOptions = {
    //     curator_rewards_percent: boundPercent,
    //   };
    //
    //   if (payoutType === PAYOUT_TYPES.PAY_0) {
    //     commentOptions.max_accepted_payout = `0.000 ${DEBT_TICKER}`;
    //   } else if (payoutType === PAYOUT_TYPES.PAY_100) {
    //     commentOptions.percent_steem_dollars = 0;
    //   }
    // }

    this.setState({
      isPosting: true,
    });

    this.handleSubmit(data);
  };

  _saveDraft = () => {
    const { editMode, permLink } = this.props;
    const { isPreview, editorId, title, text, tags, payoutType, curationPercent } = this.state;

    try {
      let body;

      if (isPreview) {
        body = text;
      } else {
        body = this.editorRef.current.getValue();
      }

      const save = {
        permLink: editMode ? permLink : undefined,
        editorId,
        title,
        text: body,
        tags,
        payoutType,
        curationPercent,
      };

      const json = JSON.stringify(save);

      if (editMode) {
        sessionStorage.setItem(EDIT_KEY, json);
      } else {
        localStorage.setItem(DRAFT_KEY, json);
      }
    } catch (err) {
      console.warn('[Golos.io] Draft not saved:', err);
    }
  };

  tryLoadDraft() {
    const { editMode, permLink } = this.props;

    let json;

    if (editMode) {
      json = sessionStorage.getItem(EDIT_KEY);
    } else {
      json = localStorage.getItem(DRAFT_KEY);
    }

    if (json) {
      const draft = JSON.parse(json);

      if (editMode && draft.permLink !== permLink) {
        return;
      }

      const { state } = this;

      state.editorId = draft.editorId;
      state.title = draft.title;
      state.text = draft.text;
      state.emptyBody = draft.text.trim().length === 0;
      state.tags = draft.tags;
      state.payoutType = draft.payoutType || PAYOUT_TYPES.PAY_50;
      state.curationPercent = draft.curationPercent || DEFAULT_CURATION_PERCENT;

      if (state.editorId === EDITORS_TYPES.MARKDOWN_OLD) {
        state.editorId = EDITORS_TYPES.MARKDOWN;
      }

      if (state.editorId === EDITORS_TYPES.HTML) {
        state.text = null;
        state.rteState = HtmlEditor.getStateFromHtml(draft.text);
      }

      return true;
    }
  }

  fillFromMetadata() {
    const { payoutType, curationPercent, post } = this.props;

    if (!post) {
      return;
    }

    const {
      title,
      body: { raw: body },
      metadata,
    } = post.content;

    if (metadata && (metadata.format === 'html' || body.startsWith('<'))) {
      this.state.editorId = EDITORS_TYPES.HTML;
    } else {
      this.state.editorId = EDITORS_TYPES.MARKDOWN;
    }

    this.state.title = title;

    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.editorId === EDITORS_TYPES.HTML) {
      this.state.text = null;
      this.state.rteState = HtmlEditor.getStateFromHtml(body);
    } else {
      this.state.text = body;
    }

    this.state.emptyBody = false;

    this.state.payoutType = payoutType;
    this.state.curationPercent = curationPercent;

    if (metadata) {
      const tagsFromData = [...(metadata.tags || [])];
      this.state.tags = processTagsFromData(tagsFromData);
    }
  }

  safeWrapper(callback) {
    return (...args) => {
      try {
        return callback(...args);
      } catch (err) {
        console.error(err);
        this.footerRef.current.showPostError('Что-то пошло не так');
      }
    };
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

  checkDisallowPost() {
    const { title, emptyBody, tags, uploadingCount } = this.state;

    if (uploadingCount > 0) {
      return 'post_editor.wait_uploading';
    }

    if (!title.trim()) {
      return 'post_editor.enter_title';
    }

    if (emptyBody) {
      return 'post_editor.enter_body';
    }

    if (!tags.length) {
      return 'category_selector_jsx.must_set_category';
    }
  }

  renderEditorPanel() {
    const { editorId, text, rteState } = this.state;
    const { editMode } = this.props;

    if (editorId === EDITORS_TYPES.MARKDOWN) {
      return (
        <div ref={this.editorWrapper}>
          <MarkdownEditor
            ref={this.editorRef}
            initialValue={text}
            scrollContainer={this.workAreaRef}
            wrapperRef={this.editorWrapper}
            placeholder={tt('post_editor.text_placeholder')}
            editMode={editMode}
            uploadImage={this.onUploadImage}
            onChangeNotify={this._onTextChangeNotify}
          />
        </div>
      );
    }
    if (editorId === EDITORS_TYPES.HTML) {
      return (
        <HtmlEditor ref={this.editorRef} value={rteState} onChange={this._onHtmlEditorChange} />
      );
    }
  }

  render() {
    const { editMode, mobileButtonsWrapperRef } = this.props;

    const {
      editorId,
      title,
      text,
      tags,
      payoutType,
      curationPercent,
      isPreview,
      uploadingCount,
      isPosting,
      isPreviewButtonVisible,
    } = this.state;

    const disallowPostCode = this.checkDisallowPost();

    return (
      <Wrapper isEdit={editMode}>
        <WorkArea ref={this.workAreaRef} isEdit={editMode}>
          <Content>
            <PreviewButton
              ref={this.previewButton}
              isPreview={isPreview}
              isVisible={isPreviewButtonVisible}
              isDesktop
              onPreviewChange={this.onPreviewChange}
            />
            <EditorSwitcherWrapper>
              <EditorSwitcher
                items={[
                  {
                    id: EDITORS_TYPES.MARKDOWN,
                    text: tt('post_editor.new_editor'),
                  },
                  {
                    id: EDITORS_TYPES.HTML,
                    text: tt('post_editor.html_editor'),
                  },
                ]}
                activeId={editorId}
                onChange={this.onEditorChange}
              />
            </EditorSwitcherWrapper>
            {isPreview ? (
              <Preview>
                <PreviewHeader>{title.trim() || tt('post_editor.title_placeholder')}</PreviewHeader>
                <MarkdownViewer text={text} large />
              </Preview>
            ) : (
              <>
                <PostTitle
                  ref={this.postTitle}
                  initialValue={title}
                  placeholder={tt('post_editor.title_placeholder')}
                  validate={this.validateTitle}
                  onTab={this.onTitleTab}
                  onChange={this.onTitleChange}
                />
                {this.renderEditorPanel()}
              </>
            )}
          </Content>
        </WorkArea>
        <Footer isEdit={editMode}>
          <FooterContent>
            <PostFooter
              ref={this.footerRef}
              editMode={editMode}
              tags={tags}
              onTagsChange={this._onTagsChange}
              payoutType={payoutType}
              onPayoutTypeChange={this._onPayoutTypeChange}
              curationPercent={curationPercent}
              onCurationPercentChange={this._onCurationPercentChange}
              postDisabled={Boolean(disallowPostCode) || isPosting || isPreview}
              disabledHint={disallowPostCode ? tt(disallowPostCode) : null}
              onPostClick={this.postSafe}
              onResetClick={this.onResetClick}
              onCancelClick={this.onCancelClick}
              mobileButtonsWrapperRef={mobileButtonsWrapperRef}
              isPreview={isPreview}
              isVisible={isPreviewButtonVisible}
              onPreviewChange={this.onPreviewChange}
            />
          </FooterContent>
        </Footer>
        {uploadingCount > 0 || isPosting ? (
          <SpinnerContainer>
            <SpinnerWrapper>
              <Icon name="clock" size={74} />
            </SpinnerWrapper>
          </SpinnerContainer>
        ) : null}
      </Wrapper>
    );
  }
}
