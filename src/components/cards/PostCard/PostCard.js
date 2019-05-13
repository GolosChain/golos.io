/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import ToastsManager from 'toasts-manager';

import { NSFW_IMAGE_URL } from 'constants/config';
import { Link } from 'shared/routes';
// import { detransliterate } from 'utils/ParsersAndFormatters';
import extractContent from 'utils/bodyProcessing/extractContent';
import Icon from 'components/golos-ui/Icon';
import { TagLink } from 'components/golos-ui/Tag';
import { proxyImage } from 'utils/images';
import VotePanel from 'components/common/VotePanel';
import { ReplyBlock } from 'components/common/ReplyBlock';
import ViewCount from 'components/common/ViewCount';
// import CurationPercent from 'components/common/CurationPercent';
import CardAuthor from '../CardAuthor';
import { EntryWrapper, PostTitle, PostContent } from '../common';

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
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  ${is('gray')`
    opacity: 0.37;
    transition: opacity 0.25s;

    &:hover {
      opacity: 1;
    }
  `};

  @media (max-width: 500px) {
    border-radius: 0;
  }
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
    // isRepost: PropTypes.bool,
    // repostHtml: PropTypes.object,
    // pinDisabled: PropTypes.bool,
    author: PropTypes.shape({}).isRequired,
    currentUserId: PropTypes.string,
    isPinned: PropTypes.bool,
    repostHtml: PropTypes.string,
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
    allowRepost: PropTypes.bool,
    router: PropTypes.shape({}).isRequired,
    // reblogData: PropTypes.instanceOf(Map),

    onClick: PropTypes.func,
    addFavorite: PropTypes.func.isRequired,
    removeFavorite: PropTypes.func.isRequired,
    fetchFavorites: PropTypes.func.isRequired,
    fetchPost: PropTypes.func.isRequired,
    reblog: PropTypes.func.isRequired,
    // togglePin: PropTypes.func.isRequired,
  };

  static defaultProps = {
    // TODO: Where we can get stats?
    stats: {},
    params: {},
    onClick: null,
    // isRepost: false,
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
    allowRepost: false,
    repostHtml: '',
    currentUserId: '',
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
          refBlockNum: +idArr[1],
          permlink: idArr[2],
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

  onRepostClick = async () => {
    const { post, reblog } = this.props;

    try {
      await reblog({
        contentId: post.contentId,
      });

      ToastsManager.info('Reblogged Successfully');
    } catch (err) {
      console.error(err);
      ToastsManager.error(err.message);
    }

    // TODO: Show dialog for enter text
    // this.props.openRepostDialog(post.contentId);
  };

  // onPinClick = () => {
  //   const { postLink, isPinned, togglePin } = this.props;

  //   togglePin(postLink, !isPinned);
  // };

  renderHeader() {
    const { compact, /* reblogData, */ post, author, postInFeed /* permLink */ } = this.props;

    // const category = detransliterate(data.get('category'));
    let created;

    // if (isRepost) {
    //   author = reblogData.get('repostAuthor');
    //   created = reblogData.get('date');
    // } else {
    //   author = data.get('author');
    //   created = data.get('created');
    // }

    // eslint-disable-next-line prefer-const
    created = post.meta.time;

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

    const currentFeed = !['/hot', '/trending'].includes(router.asPath) ? router.asPath : '/created';
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
        <Link route="post" params={{ ...post.contentId, mode: 'edit' }} passHref>
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
        </Link>
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
    const { allowRepost } = this.props;

    if (allowRepost) {
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
    return null;
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
    const { repostHtml, post, postInFeed } = this.props;

    // const author = data.get('author');
    // const created = data.get('created');
    const author = {
      id: 'pepo',
      username: 'pepo',
    };
    const created = '2019-03-13T15:35:51.749Z';

    return (
      <RepostBlock>
        {repostHtml ? (
          <RepostBody>
            <PostContent dangerouslySetInnerHTML={repostHtml} />
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

    const content = extractContent(post.content.body);
    let imageLink;

    if (content.image && !stats.gray && !stats.hide) {
      imageLink = warnNsfw ? NSFW_IMAGE_URL : proxyImage(content.image, PREVIEW_IMAGE_SIZE);
    }

    return (
      <Link route="post" params={post.contentId} passHref>
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
      </Link>
    );
  }

  renderFooter() {
    const { post, compact } = this.props;

    return (
      <Footer compact={compact}>
        <FooterToolbar compact={compact}>
          <VotePanelStyled entity={post} compact />
          {this.renderEditButton()}
          {/* {this.renderPinButton()}
          {this.renderRepostButton()} */}
          {this.renderFavoriteButton()}
        </FooterToolbar>
        {compact ? null : <Filler />}
        <ReplyBlock
          isLink
          compact={compact}
          count={post.stats.commentsCount}
          link={post.id}
          text={tt('g.reply')}
        />
      </Footer>
    );
  }

  render() {
    // return <Wrapper>{JSON.stringify(this.props.post)}</Wrapper>;

    const { /* isRepost, */ hideNsfw, stats, isHidden, post, className } = this.props;

    // user wishes to hide these posts entirely
    if (hideNsfw || isHidden || !post) {
      return null;
    }

    return (
      <Wrapper className={className} gray={stats.gray || stats.hide}>
        {this.renderHeader()}
        {/* {isRepost ? this.renderRepostPart() : null} */}
        {this.renderBody()}
        {this.renderFooter()}
      </Wrapper>
    );
  }
}
