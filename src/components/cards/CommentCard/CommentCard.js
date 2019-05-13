import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'shared/routes';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

// import { detransliterate } from 'utils/ParsersAndFormatters';
import { isHide } from 'utils/StateFunctions';
import { getScrollElement } from 'helpers/window';
import CommentFormLoader from 'components/modules/CommentForm/loader';
import { displayMessage } from 'utils/toastMessages';
import { formatContentId } from 'store/schemas/gate';

import Button from 'components/golos-ui/Button';
import { TagLink } from 'components/golos-ui/Tag';
import MarkdownViewer from 'components/cards/MarkdownViewer/MarkdownViewer';
import { EntryWrapper } from '../common';
import CloseOpenButton from '../CloseOpenButton';
import CommentFooter from '../CommentFooter';
import CardAuthor from '../CardAuthor';
import EditButton from '../EditButton';
import ReLink from '../ReLink';

const Header = styled.div`
  padding: 12px 0 8px 0;
  flex-shrink: 0;

  ${is('collapsed')`
    padding: 5px 0;
  `};
`;

const HeaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 18px;
  pointer-events: none;

  ${is('alertmode')`
    justify-content: unset;
  `};

  & > * {
    pointer-events: initial;
  }
`;

const Category = styled(TagLink)`
  margin-right: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;

  @media (max-width: 500px) {
    display: none;
  }
`;

const MobileCategory = styled(TagLink)`
  && {
    margin: 15px 0;
    max-width: 100%;
    width: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }

  @media (min-width: 501px) {
    display: none;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 18px;

  margin-bottom: 8px;
`;

const CommentBodyLink = styled.a`
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  text-decoration: none;
`;

const CommentBody = styled(({ shortText, isPostPage, to, children, ...otherProps }) =>
  isPostPage ? (
    <div {...otherProps}>{children}</div>
  ) : (
    <Link route={to} passHref>
      <CommentBodyLink {...otherProps}>{children}</CommentBodyLink>
    </Link>
  )
)`
  display: block;
  flex-grow: 1;

  margin-right: 18px;
  overflow-x: hidden;

  font-family: ${({ theme }) => theme.fontFamily};
  color: #959595 !important;

  ${is('shortText')`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `};
`;

const CommentBodyWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 18px;
`;

const Wrapper = styled(EntryWrapper)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 50px;
  margin: -1px -1px 15px -1px;
  border: 1px solid transparent;

  ${is('highlighted')`
    box-shadow: 0 0 0 0.2rem #c8e1ff;
    border-color: #2188ff;
    border-radius: 3px;
  `};

  ${is('renderCard')`
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  `};

  ${is('collapsed')`
    justify-content: center;
  `};

  ${is('gray')`
    opacity: 0.37;
    transition: opacity 0.25s;

    &:hover {
      opacity: 1;
    }
  `};
`;

const Reply = styled.div`
  padding: 0 18px 0 60px;

  @media (max-width: 450px) {
    padding-left: 40px;
  }
`;

// const LoaderWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   height: 90px;
//   opacity: 0;
//   animation: fade-in 0.25s forwards;
//   animation-delay: 0.25s;
// `;

const TogglerWrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const EmptyCloseOpenButton = styled.div`
  flex-shrink: 0;

  width: 30px;
  height: 30px;
`;

const SpamBlock = styled.div`
  display: flex;
  align-items: center;
  margin-right: 40px;

  @media (max-width: 576px) {
    flex-wrap: wrap;

    & ${Button} {
      margin-top: 5px;
    }
  }
`;

const SpamText = styled.div`
  margin-right: 10px;
  font-size: 15px;
  color: #8a8a8a;
`;

const MobileTagWrapper = styled.div`
  @media (max-width: 500px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: calc(100% - 40px);
    overflow: hidden;
  }
`;

export default class CommentCard extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({}),
    // permLink: PropTypes.string,
    isPostPage: PropTypes.bool,
    id: PropTypes.string,

    comment: PropTypes.shape({}).isRequired,
    stats: PropTypes.shape({}),
    // title: PropTypes.string.isRequired,
    extractedContent: PropTypes.shape({
      link: PropTypes.string,
      desc: PropTypes.string,
      body: PropTypes.string,
    }),
    childrenCount: PropTypes.number.isRequired,
    showSpam: PropTypes.bool,
    isOwner: PropTypes.bool.isRequired,
    username: PropTypes.string,
    payout: PropTypes.number,
    author: PropTypes.shape({}),

    onClick: PropTypes.func,
  };

  static defaultProps = {
    location: {},
    // permLink: '',
    isPostPage: false,
    stats: null,
    extractedContent: null,
    username: '',
    payout: 0,
    id: '',
    showSpam: false,
    author: null,
    onClick: () => {},
  };

  state = {
    showReply: false,
    edit: false,
    collapsed: false,
    highlighted: false,
    showAlert: this.isNeedShowAlert(this.props),
    /* eslint-disable react/destructuring-assignment, react/prop-types */
    profileCommentParentPost: this.props.comment?.parent?.post?.contentId
      ? formatContentId(this.props.comment.parent.post.contentId)
      : null,
    /* eslint-enable */
  };

  commentRef = createRef();

  replyRef = createRef();

  commentTitleRef = createRef();

  componentDidMount() {
    this.tryHighlightComment();
  }

  componentWillReceiveProps(props) {
    const { location, stats } = this.props;

    // eslint-disable-next-line react/prop-types
    if (props.location.hash !== location.hash) {
      this.tryHighlightComment();
    }

    if (!stats && props.stats) {
      this.setState({
        showAlert: this.isNeedShowAlert(props),
      });
    }
  }

  rememberScrollPosition = () => {
    const { onClick } = this.props;
    onClick();
  };

  tryHighlightComment = () => {
    const { id } = this.props;
    const { highlighted } = this.state;

    if (window.location.hash.replace('#', '') === id && !highlighted) {
      const commentEl = document.getElementById(id);
      if (commentEl) {
        commentEl.scrollIntoView(true);
        getScrollElement().scrollTop -= 200;
        this.setState({ highlighted: true });
      }
    } else if (highlighted) {
      this.setState({ highlighted: false });
    }
  };

  // eslint-disable-next-line
  isNeedShowAlert(props) {
    if (props.stats && !props.showSpam) {
      return props.stats.gray;
    }

    return false;
  }

  getFullParentUrl = () => {
    const { comment } = this.props;
    const { profileCommentParentPost } = this.state;
    let parentLink = profileCommentParentPost ? `/@${profileCommentParentPost}` : '#';

    if (profileCommentParentPost && comment.parentComment) {
      parentLink = `/@${profileCommentParentPost}/#${formatContentId(
        comment.parentComment.contentId
      )}`;
    }
    return parentLink;
  };

  onReplySuccess = () => {
    this.setState({
      showReply: false,
    });

    displayMessage(tt('g.reply_has_published'));
  };

  onReplyCancel = () => {
    this.setState({
      showReply: false,
    });
  };

  onEditClick = () => {
    this.setState({
      edit: true,
    });
  };

  onEditDone = () => {
    this.setState({
      edit: false,
    });
  };

  onReplyClick = () => {
    this.setState({
      showReply: true,
    });
  };

  toggleComment = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  onShowClick = () => {
    this.setState({
      showAlert: false,
    });
  };

  renderHeaderForPost() {
    const { comment, author, isPostPage } = this.props;
    const { collapsed, showAlert, profileCommentParentPost } = this.state;

    return (
      <Header collapsed={collapsed}>
        <HeaderLine alertmode={showAlert}>
          <CardAuthor
            infoPopover
            commentInPost
            contentLink={comment.url}
            author={author}
            created={comment.meta.time}
          />
          {showAlert ? (
            <SpamBlock>
              <SpamText>{tt('comment_card.hidden')}</SpamText>
              <Button light onClick={this.onShowClick}>
                {tt('g.show')}
              </Button>
            </SpamBlock>
          ) : (
            <>
              {collapsed ? (
                <CommentBody
                  to={
                    profileCommentParentPost ? `/@${profileCommentParentPost}/#${comment.id}` : '#'
                  }
                  shortText
                  isPostPage={isPostPage}
                  dangerouslySetInnerHTML={{
                    __html: comment.content.body.full,
                  }}
                  onClick={this.rememberScrollPosition}
                />
              ) : null}
              <EmptyCloseOpenButton />
            </>
          )}
        </HeaderLine>
      </Header>
    );
  }

  renderHeaderForProfile() {
    const { comment, author } = this.props;
    const { collapsed } = this.state;

    const category = comment.content?.metadata?.tags?.[0] || null;

    return (
      <Header collapsed={collapsed}>
        <HeaderLine>
          {collapsed ? (
            <ReLink
              fullParentURL={this.getFullParentUrl()}
              title={
                comment?.parent?.post?.content?.title ||
                comment?.parentComment?.content?.body?.preview
              }
              onClick={this.rememberScrollPosition}
            />
          ) : (
            <MobileTagWrapper>
              <CardAuthor
                contentLink={comment.url}
                author={author}
                contentId={comment.contentId}
                created={comment.meta.time}
              />
              {category ? (
                <MobileCategory route={`/created?tags=${category}`} category={1}>
                  {category}
                </MobileCategory>
              ) : null}
            </MobileTagWrapper>
          )}
          <TogglerWrapper>
            {category ? (
              <Category route={`/created?tags=${category}`} category={1}>
                {category}
              </Category>
            ) : null}
            <CloseOpenButton collapsed={collapsed} onClick={this.toggleComment} />
          </TogglerWrapper>
        </HeaderLine>
      </Header>
    );
  }

  renderTitle() {
    const { isOwner, comment } = this.props;
    const { edit } = this.state;

    return (
      <Title ref={this.commentTitleRef}>
        <ReLink
          fullParentURL={this.getFullParentUrl()}
          title={
            comment?.parent?.post?.content?.title || comment?.parentComment?.content?.body?.preview
          }
          onClick={this.rememberScrollPosition}
        />
        {isOwner && !edit && <EditButton onClick={this.onEditClick} />}
      </Title>
    );
  }

  renderBodyText() {
    const { comment, isOwner, isPostPage, payout } = this.props;
    const { edit, profileCommentParentPost } = this.state;

    if (edit) {
      return (
        <CommentFormLoader
          reply
          editMode
          hideFooter
          autoFocus
          params={comment}
          parentPost={comment.parent.post.contentId}
          forwardRef={this.commentRef}
          commentTitleRef={this.commentTitleRef.current}
          onSuccess={this.onEditDone}
          onCancel={this.onEditDone}
        />
      );
    }

    return (
      <CommentBodyWrapper>
        <CommentBody
          to={profileCommentParentPost ? `/@${profileCommentParentPost}/#${comment.id}` : '#'}
          isPostPage={isPostPage}
          onClick={this.rememberScrollPosition}
        >
          <MarkdownViewer
            text={comment.content.body.full}
            jsonMetadata={comment.json_metadata}
            highQualityPost={payout > 10}
            // noImage={!comment.getIn(['stats', 'pictures'])}
          />
        </CommentBody>
        {isOwner && isPostPage && <EditButton onClick={this.onEditClick} />}
      </CommentBodyWrapper>
    );
  }

  renderReplyEditor() {
    const { comment, username } = this.props;

    return (
      <Reply>
        <CommentFormLoader
          reply
          hideFooter
          autoFocus
          withHeader
          params={comment}
          parentPost={comment.parent.post.contentId}
          forwardRef={this.replyRef}
          replyAuthor={username}
          onSuccess={this.onReplySuccess}
          onCancel={this.onReplyCancel}
        />
      </Reply>
    );
  }

  render() {
    const {
      comment,
      username,
      isOwner,
      isPostPage,
      className,
      stats,
      showSpam,
      id,
      childrenCount,
    } = this.props;

    const { showReply, collapsed, edit, highlighted, showAlert } = this.state;

    if (!showSpam && stats && stats.hide) {
      return null;
    }

    if (isHide(comment)) {
      return null;
    }

    return (
      <Wrapper
        id={id}
        highlighted={highlighted}
        renderCard={!isPostPage}
        collapsed={collapsed}
        className={className}
        gray={stats && (stats.gray || stats.hide) && !isPostPage}
      >
        {isPostPage ? this.renderHeaderForPost() : this.renderHeaderForProfile()}
        {collapsed || showAlert ? null : (
          <>
            {!isPostPage && this.renderTitle()}
            {this.renderBodyText()}
            {showReply && this.renderReplyEditor()}
            <CommentFooter
              comment={comment}
              contentLink={comment.id}
              count={childrenCount}
              isOwner={isOwner}
              showReply={showReply}
              edit={edit}
              currentUsername={username}
              replyRef={this.replyRef}
              commentRef={this.commentRef}
              onReplyClick={this.onReplyClick}
            />
          </>
        )}
      </Wrapper>
    );
  }
}
