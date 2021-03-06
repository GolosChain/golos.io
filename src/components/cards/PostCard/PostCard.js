/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { NSFW_IMAGE_URL } from 'constants/config';
import SmartLink from 'components/common/SmartLink';
// import { detransliterate } from 'utils/ParsersAndFormatters';
import extractContent from 'utils/bodyProcessing/extractContent';
import { proxyImage } from 'utils/images';
import { displayError } from 'utils/toastMessages';
import Icon from 'components/golos-ui/Icon';
import { TagLink } from 'components/golos-ui/Tag';
import VotePanel from 'components/common/VotePanel';
import ReplyBlock from 'components/common/ReplyBlock';
import ViewCount from 'components/common/ViewCount';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import SmartLazyLoad from 'components/common/SmartLazyLoad';
// import CurationPercent from 'components/common/CurationPercent';

import CardAuthor from '../CardAuthor';
import { cardStyle, EntryWrapper, PostTitle, PostContent } from '../common';

const PREVIEW_IMAGE_SIZE = '859x356';

const Header = styled.div`
  padding: 10px 0;
  flex-shrink: 0;
`;

const HeaderRepost = styled(Header)`
  padding: 0 0 10px;

  ${is('postInFeed')`
    position: relative;
  `};
`;

const HeaderLine = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 18px;
  pointer-events: none;

  & > * {
    pointer-events: initial;
  }

  @media (min-width: 361px) and (max-width: 400px) {
    padding: 2px 10px;
  }
`;

const ToolbarAction = styled.div`
  flex-shrink: 0;
`;

const ToolbarEditAction = styled.a`
  flex-shrink: 0;

  @media (max-width: 880px) {
    display: none;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #393636;

  ${is('enabled')`
    cursor: pointer;
  `};

  ${is('isPinned')`
    & ${Icon} {
      color: #2879ff;
    }
  `};
`;

const BodyLink = styled.a`
  display: block;
  transition: none !important;

  ${is('compact')`
    flex-shrink: 1;
    flex-grow: 1;
    overflow: hidden;
  `};

  &:visited {
    ${PostTitle} {
      color: #999;
    }
  }
`;

const Body = styled.div`
  position: relative;
  padding: 0 18px 12px;

  @media (min-width: 361px) and (max-width: 400px) {
    padding: 0 10px 12px;
  }
`;

const RepostBody = styled(Body)`
  margin-bottom: 10px;
  border-bottom: 1px solid #e1e1e1;
`;

const RepostBlock = styled.div``;

const Footer = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  z-index: 1;
  pointer-events: none;

  & > * {
    pointer-events: initial;
  }

  ${is('compact')`
    flex-direction: column;
    align-items: center;
  `};
`;

const FooterToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 7px;

  ${is('compact')`
    width: 100%;
  `};

  @media (max-width: 400px) {
    padding: 0 5px 7px;
  }

  @media (max-width: 359px) {
    justify-content: center;

    & > *:nth-child(n + 3) {
      display: none;
    }
  }

  & > :not(:first-child) {
    margin-left: 24px;

    @media (max-width: 700px) {
      margin-left: 6px;
    }

    ${is('compact')`
      margin-left: 0 !important;
    `};
  }
`;

const VotePanelStyled = styled(VotePanel)`
  margin-left: -7px;

  @media (max-width: 400px) {
    margin-left: 0;
  }
`;

const PostImageWrapper = styled.div`
  @media (max-width: 500px) {
    margin: 0 18px;
  }
`;

const PostImage = styled.div.attrs(({ src }) => ({
  style: {
    backgroundImage: `url("${src}")`,
  },
}))`
  width: 100%;
  height: 356px;
  max-height: 60vh;
  margin-bottom: 14px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  ${is('compact')`
    height: 183px;
  `};
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const Wrapper = styled(EntryWrapper)`
  position: relative;
  ${cardStyle};

  ${is('gray')`
    opacity: 0.37;
    transition: opacity 0.25s;

    &:hover {
      opacity: 1;
    }
  `};
`;

const HeaderRightPanel = styled.div`
  display: flex;
  align-items: center;

  ${is('compact')`
    flex-direction: column;
    align-items: flex-end;
    margin-top: -2px;
    margin-bottom: 2px;
  `};
`;

const HeaderStatusIcons = styled.div`
  display: flex;
  align-items: center;

  & > :last-child {
    margin-left: 32px;
  }

  & > :first-child {
    margin-left: 20px;
  }

  ${is('compact')`
    margin-bottom: 4px;

    & > :last-child {
      margin-left: 20px;
    }
  `};
`;

// const CurationPercentStyled = styled(CurationPercent)`
//   @media (max-width: 340px) {
//     display: none;
//   }
// `;

const Category = styled(TagLink)`
  margin-left: 32px;
`;

@withRouter
export default class PostCard extends PureComponent {
  static propTypes = {
    // // external
    // permLink: PropTypes.string.isRequired,
    compact: PropTypes.bool,
    // showPinButton: PropTypes.bool,
    //
    // // connect
    // data: PropTypes.object,
    // postLink: PropTypes.string.isRequired,
    // pinDisabled: PropTypes.bool,
    author: PropTypes.shape({}).isRequired,
    repostAuthor: PropTypes.shape({}),
    currentUserId: PropTypes.string,
    isLowReputation: PropTypes.bool,
    isPinned: PropTypes.bool,
    id: PropTypes.string.isRequired,
    hideNsfw: PropTypes.bool,
    warnNsfw: PropTypes.bool,
    isHidden: PropTypes.bool,
    stats: PropTypes.shape({}),
    post: PropTypes.shape({}).isRequired,
    params: PropTypes.shape({}),
    isOwner: PropTypes.bool,
    postInFeed: PropTypes.bool,
    isFavorite: PropTypes.bool,
    showPinButton: PropTypes.bool,
    pinDisabled: PropTypes.bool,
    router: PropTypes.shape({}).isRequired,

    onClick: PropTypes.func,
    addFavorite: PropTypes.func.isRequired,
    removeFavorite: PropTypes.func.isRequired,
    fetchFavorites: PropTypes.func.isRequired,
    fetchPost: PropTypes.func.isRequired,
    removeReblog: PropTypes.func.isRequired,
    openRepostDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    // TODO: Where we can get stats?
    stats: {},
    params: {},
    onClick: null,
    hideNsfw: false,
    warnNsfw: false,
    isHidden: false,
    isOwner: false,
    compact: false,
    postInFeed: false,
    isFavorite: false,
    isPinned: false,
    showPinButton: false,
    pinDisabled: false,
    repostHtml: '',
    currentUserId: '',
    isLowReputation: false,
  };

  state = {
    isReblogRemoving: false,
  };

  async componentDidMount() {
    const { post, fetchPost, id } = this.props;
    window.addEventListener('resize', this.onResize);

    if (!post) {
      const idArr = id ? id.split('/') : [];
      let contentId;

      if (idArr.length) {
        contentId = {
          userId: idArr[0],
          permlink: idArr[1],
        };
      }

      try {
        if (contentId) {
          await fetchPost(contentId);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`Unable to load ${id}`);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onFavoriteClick = async () => {
    const { post, isFavorite, addFavorite, removeFavorite, fetchFavorites } = this.props;
    try {
      if (isFavorite) {
        await removeFavorite(post.id);
      } else {
        await addFavorite(post.id);
      }
      fetchFavorites();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  };

  onRepostClick = () => {
    const { post, openRepostDialog } = this.props;

    openRepostDialog({
      contentId: post.contentId,
    });
  };

  onRemoveClick = async () => {
    const { post, removeReblog } = this.props;

    this.setState({ isReblogRemoving: true });

    try {
      await removeReblog(post);
    } catch (err) {
      displayError(err);
    }

    this.setState({ isReblogRemoving: false });
  };

  // onPinClick = () => {
  //   const { postLink, isPinned, togglePin } = this.props;

  //   togglePin(postLink, !isPinned);
  // };

  renderHeader() {
    const { compact, post, repostAuthor, postInFeed /* permLink */ } = this.props;
    let { author } = this.props;

    // const category = detransliterate(data.get('category'));
    let created;

    if (post?.repost?.isRepost) {
      author = repostAuthor;
      created = post.repost?.time;
    } else {
      created = post.meta.time;
    }

    return (
      <Header>
        <HeaderLine>
          <CardAuthor
            infoPopover={postInFeed}
            contentId={post.contentId}
            author={author}
            created={created}
          />
          <Filler />
          <HeaderRightPanel compact={compact}>
            <HeaderStatusIcons compact={compact}>
              <ViewCount contentUrl={post.id} mini />
              {/* <CurationPercentStyled postLink={permLink} mini /> */}
            </HeaderStatusIcons>
            {this.renderCategory()}
          </HeaderRightPanel>
        </HeaderLine>
      </Header>
    );
  }

  renderCategory() {
    const { post, router } = this.props;
    const category = post.content?.metadata?.tags?.[0] || null;

    if (!category) {
      return null;
    }

    const asPath = router.asPath.replace(/\?.*$/, '');
    const currentFeed = !['/hot', '/trending'].includes(asPath) ? asPath : '/created';
    const categoryUri = `${currentFeed}?tags=${category}`;

    return (
      <Category
        route={categoryUri}
        category={1}
        aria-label={tt('aria_label.category', { category })}
        passHref
      >
        {category}
      </Category>
    );
  }

  renderEditButton() {
    const { isOwner, post } = this.props;

    if (isOwner) {
      return (
        <SmartLink route="post" params={{ ...post.contentId, mode: 'edit' }}>
          <ToolbarEditAction name="post-card__edit">
            <IconWrapper
              enabled
              role="button"
              aria-label={tt('g.edit')}
              data-tooltip={tt('g.edit')}
            >
              <Icon name="pen" width={23} height={23} />
            </IconWrapper>
          </ToolbarEditAction>
        </SmartLink>
      );
    }
    return null;
  }

  renderPinButton() {
    const { currentUserId, showPinButton, isPinned, pinDisabled } = this.props;

    // TODO:
    const author = 'kek';

    const showPin = showPinButton && currentUserId === author && (!pinDisabled || isPinned);

    if (!showPin) {
      return;
    }

    let pinTip;

    if (showPinButton) {
      if (pinDisabled) {
        if (isPinned) {
          pinTip = tt('post_card.post_pinned');
        }
      } else if (isPinned) {
        pinTip = tt('post_card.unpin_post');
      } else {
        pinTip = tt('post_card.pin_post');
      }
    }

    // eslint-disable-next-line consistent-return
    return (
      <ToolbarAction name="post-card__pin">
        <IconWrapper
          role="button"
          aria-label={pinTip}
          data-tooltip={pinTip}
          enabled={!pinDisabled}
          isPinned={isPinned}
          onClick={!pinDisabled ? this.onPinClick : null}
        >
          <Icon name="pin" width={23} height={23} />
        </IconWrapper>
      </ToolbarAction>
    );
  }

  renderRepostButton() {
    const { isOwner } = this.props;

    if (isOwner) {
      return null;
    }

    return (
      <ToolbarAction name="post-card__repost">
        <IconWrapper
          role="button"
          aria-label={tt('post_card.repost')}
          data-tooltip={tt('post_card.repost')}
          enabled
          onClick={this.onRepostClick}
        >
          <Icon name="repost" width={25} />
        </IconWrapper>
      </ToolbarAction>
    );
  }

  renderRemoveButton() {
    const { isOwner, post } = this.props;
    const { isReblogRemoving } = this.state;

    if (!isOwner || !post.repost?.isRepost) {
      return;
    }

    return (
      <ToolbarAction name="post-card__remove">
        {isReblogRemoving ? (
          <LoadingIndicator type="circle" size={24} />
        ) : (
          <IconWrapper
            role="button"
            aria-label={tt('post_card.remove')}
            data-tooltip={tt('post_card.remove')}
            enabled
            onClick={this.onRemoveClick}
          >
            <Icon name="mute" width={24} />
          </IconWrapper>
        )}
      </ToolbarAction>
    );
  }

  renderFavoriteButton() {
    const { isFavorite, currentUserId } = this.props;

    const favoriteText = isFavorite ? tt('g.remove_from_favorites') : tt('g.add_to_favorites');

    return currentUserId ? (
      <ToolbarAction name="post-card__favorite">
        <IconWrapper
          role="button"
          aria-label={favoriteText}
          data-tooltip={favoriteText}
          enabled
          onClick={this.onFavoriteClick}
        >
          <Icon name={isFavorite ? 'star_filled' : 'star'} width={24} />
        </IconWrapper>
      </ToolbarAction>
    ) : null;
  }

  renderRepostPart() {
    const { author, post, postInFeed } = this.props;

    const created = post.meta.time;
    const repostHtml = post?.repost?.body?.raw;

    return (
      <RepostBlock>
        {repostHtml ? (
          <RepostBody>
            <PostContent>{repostHtml}</PostContent>
          </RepostBody>
        ) : null}
        <HeaderRepost postInFeed={postInFeed}>
          <HeaderLine>
            <CardAuthor
              infoPopover={postInFeed}
              popoverOffsetTop={42}
              contentId={post.contentId}
              author={author}
              created={created}
              isRepost
            />
            <Filler />
          </HeaderLine>
        </HeaderRepost>
      </RepostBlock>
    );
  }

  renderBody() {
    const { compact, stats, post, warnNsfw, onClick } = this.props;

    if (!post.content.body?.raw) {
      console.error('Repost without body:', post);
      return null;
    }

    const content = extractContent(post.content.body);
    let imageLink;

    if (content.image && !stats.gray && !stats.hide) {
      imageLink = warnNsfw ? NSFW_IMAGE_URL : proxyImage(content.image, PREVIEW_IMAGE_SIZE);
    }

    return (
      <SmartLink route="post" params={post.contentId}>
        <BodyLink compact={compact ? 1 : 0} onClick={onClick}>
          {imageLink ? (
            <PostImageWrapper>
              <PostImage compact={compact} src={imageLink} />
            </PostImageWrapper>
          ) : null}
          <Body>
            <PostTitle>{post.content.title}</PostTitle>
            <PostContent dangerouslySetInnerHTML={{ __html: content.desc }} />
          </Body>
        </BodyLink>
      </SmartLink>
    );
  }

  renderFooter() {
    const { post, compact } = this.props;

    return (
      <Footer compact={compact}>
        <FooterToolbar compact={compact}>
          <VotePanelStyled entity={post} compact />
          {this.renderEditButton()}
          {/* {this.renderPinButton()} */}
          {this.renderRepostButton()}
          {this.renderFavoriteButton()}
          {this.renderRemoveButton()}
        </FooterToolbar>
        {compact ? null : <Filler />}
        <ReplyBlock
          isLink
          compact={compact}
          count={post.stats.commentsCount}
          postContentId={post.contentId}
          text={tt('g.reply')}
        />
      </Footer>
    );
  }

  render() {
    // return <Wrapper>{JSON.stringify(this.props.post)}</Wrapper>;

    const { hideNsfw, isHidden, post, isLowReputation, className } = this.props;

    // user wishes to hide these posts entirely
    if (hideNsfw || isHidden || !post || isLowReputation) {
      return null;
    }

    return (
      <Wrapper gray={post.stats.gray || post.stats.hide} className={className}>
        <SmartLazyLoad once resize height={500} offset={300}>
          {this.renderHeader()}
          {post?.repost?.isRepost ? this.renderRepostPart() : null}
          {this.renderBody()}
          {this.renderFooter()}
        </SmartLazyLoad>
      </Wrapper>
    );
  }
}
