import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import { withRouter } from 'next/router';

import { NSFW_IMAGE_URL } from 'constants/config';
import { Link } from 'shared/routes';
import { proxyImage } from 'utils/images';
import { breakWordStyles } from 'helpers/styles';
import { smartTrim } from 'helpers/text';
import { detransliterate, repLog10 } from 'utils/ParsersAndFormatters';
import extractContent from 'utils/bodyProcessing/extractContent';
import Icon from 'components/golos-ui/Icon';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import { VotePanelCompact } from 'components/common/VotePanel';
import CompactPostCardMenu from 'components/common/CompactPostCardMenu';
import { ReplyBlock } from 'components/common/ReplyBlock';
import ViewCount from 'components/common/ViewCount';

const MOBILE_THRESHOLD = 500;
const PREVIEW_WIDTH = 148;
const PREVIEW_HEIGHT = 80;
const MOBILE_PREVIEW_WIDTH = 108;
const MOBILE_PREVIEW_HEIGHT = 60;
const EXTEND_HEADER_THRESHOLD = 850;
const PREVIEW_SIZE = `${PREVIEW_WIDTH}x${PREVIEW_HEIGHT}`;

const TEXT_LENGTH_LIMIT = 194; // Примерно 3 строки текста
const MOBILE_TEXT_LENGTH_LIMIT = 120;

const Wrapper = styled.div`
  margin-bottom: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    margin-bottom: 10px;
    border-radius: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: 0 20px;

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    padding: 0 16px;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${EXTEND_HEADER_THRESHOLD}px) {
    display: block;
  }
`;

const Header = styled.div`
  margin-bottom: 16px;
  border-bottom: 1px solid #e1e1e1;

  @media (max-width: ${EXTEND_HEADER_THRESHOLD}px) {
    margin-bottom: 2px;
    border-bottom: none;
  }
`;

const HeaderLeft = styled(ContentWrapper)`
  display: flex;
  align-items: center;
  min-height: 48px;

  @media (max-width: ${EXTEND_HEADER_THRESHOLD}px) {
    border-bottom: 1px solid #e1e1e1;
  }
`;

const HeaderRight = styled(ContentWrapper)`
  display: flex;
  align-items: center;
  min-height: 48px;

  & > * {
    margin-left: 28px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const Body = styled.div`
  margin-top: -4px;
  overflow: hidden;
`;

const PostTitle = styled.div`
  padding-top: 3px;
  margin-bottom: 9px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.13;
  color: #393636;
  ${breakWordStyles};

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    margin-bottom: 4px;
    line-height: 1.14;
    font-size: 14px;
  }
`;

const activeStyle = css`
  color: #959595;
  cursor: pointer;
  transition: color 0.15s;

  &:focus,
  &:hover {
    color: #333;
  }
`;

const LinkStyled = styled.a`
  ${activeStyle};
`;

const PostContent = styled.div`
  font-size: 14px;
  line-height: 1.29;
  color: #393636;
  ${breakWordStyles};

  ${is('repost')`
    padding-top: 3px;
    margin-bottom: 7px;
  `};

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    font-size: 12px;
    line-height: 1.08;
  }
`;

const BodyBlock = styled.div`
  display: flex;
`;

const PostImage = styled.img`
  width: ${PREVIEW_WIDTH}px;
  height: ${PREVIEW_HEIGHT}px;
  border-radius: 6px;

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    width: ${MOBILE_PREVIEW_WIDTH}px;
    height: ${MOBILE_PREVIEW_HEIGHT}px;
  }
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  margin-top: 6px;
  min-height: 20px;

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    justify-content: space-between;
    padding-bottom: 0;
    margin-top: 0;

    ${Filler} {
      display: none;
    }
  }
`;

const Splitter = styled.div`
  flex-shrink: 0;
  width: 1px;
  height: 20px;
  margin: 0 10px;
  background: #e1e1e1;

  @media (max-width: 1100px) {
    margin: 0 5px;
  }

  @media (max-width: 370px) {
    margin: 0;
  }

  @media (max-width: 340px) {
    margin: 0 -1px;
  }
`;

const DetailsBlock = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #393636;
  user-select: none;
  overflow: hidden;
`;

const DateLink = styled(LinkStyled)`
  font-size: 13px;
  color: #959595;
`;

const AuthorLink = styled(LinkStyled)`
  padding-left: 3px;
  padding-right: 3px;
  user-select: none;
  white-space: nowrap;
  color: #393636;
`;

const RepostArrowIcon = styled(Icon).attrs({ name: 'repost_solid' })`
  width: 9px;
  margin: 0 2px;

  @media (max-width: 500px) {
    margin: 0;
  }
`;

const AuthorName = styled.div`
  display: inline-block;
`;

const AuthorRating = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 18px;
  margin-left: 4px;
  border: 1px solid #b7b7b9;
  border-radius: 100px;
  text-align: center;
  font-size: 12px;
  transition: border-color 0.15s;
`;

const CategoryLink = styled(LinkStyled)`
  padding-left: 5px;
  padding-right: 10px;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #393636;
`;

const CategoryLinkIn = styled.span`
  color: #393636;
`;

const ImageLink = styled.a`
  flex-shrink: 0;
  margin-right: 19px;

  @media (max-width: ${MOBILE_THRESHOLD}px) {
    margin-right: 15px;
  }
`;

const BodyLink = styled.a`
  display: block;
`;

const RepostButton = styled.button`
  padding: 0 10px;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  ${activeStyle};
`;

const RepostIcon = styled(Icon).attrs({
  name: 'repost',
})`
  display: block;
  width: 17px;

  @media (max-width: 500px) {
    width: 15px;
  }
`;

const MenuWrapper = styled.div`
  position: relative;
`;

const DotsIcon = styled(Icon).attrs({
  name: 'dots_horizontal',
})`
  display: block;
  width: 38px;
  padding: 0 10px;
  margin-right: -10px;
  color: #959595;
  user-select: none;
  ${activeStyle};

  @media (max-width: 500px) {
    width: 34px;
  }
`;

@withRouter
export default class PostCardCompact extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    author: PropTypes.shape().isRequired,
  };

  state = {
    menu: false,
  };

  async componentDidMount() {
    const { post, fetchPost, id } = this.props;

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

  onRepostClick = () => {
    this.props.openRepostDialog(this.props.postLink);
  };

  onMenuHandlerClick = () => {
    this.setState({
      menu: true,
    });
  };

  onMenuClose = () => {
    this.setState({
      menu: false,
    });
  };

  renderHeader() {
    const { post, isRepost } = this.props;

    let created;

    if (isRepost) {
      created = post.repost.time;
    } else {
      created = post.meta.time;
    }

    return (
      <Header>
        <HeaderWrapper>
          <HeaderLeft>{this.renderDetails()}</HeaderLeft>
          <HeaderRight>
            <ViewCount contentUrl={post.id} micro />
            {/*<CurationPercent postLink={permLink} micro />*/}
            <Link route="post" params={post.contentId} passHref>
              <DateLink>
                <TimeAgoWrapper date={created} />
              </DateLink>
            </Link>
          </HeaderRight>
        </HeaderWrapper>
      </Header>
    );
  }

  renderBody() {
    const { post, stats, isRepost, repostHtml, warnNsfw, isMobile } = this.props;

    if (!post.content.body?.raw) {
      console.error('Repost without body:', post);
      return null;
    }

    const content = extractContent(post.content.body);
    let imageLink;

    if (content.image && !stats.gray && !stats.hide) {
      imageLink = warnNsfw ? NSFW_IMAGE_URL : proxyImage(content.image, PREVIEW_SIZE);
    }

    let trimLength = isMobile ? MOBILE_TEXT_LENGTH_LIMIT : TEXT_LENGTH_LIMIT;

    if (imageLink) {
      trimLength = Math.floor(trimLength * 1.3);
    }

    const text = post.content.body.preview || content.desc;

    return (
      <BodyBlock onClick={this.props.onClick}>
        {imageLink ? (
          <Link route="post" params={post.contentId} passHref>
            <ImageLink onClick={this.props.onClick}>
              <PostImage alt={tt('aria_label.post_image')} src={imageLink} />
            </ImageLink>
          </Link>
        ) : null}
        <Body>
          <Link route="post" params={post.contentId} passHref>
            <BodyLink onClick={this.props.onClick}>
              {isRepost ? <PostContent repost dangerouslySetInnerHTML={repostHtml} /> : null}
              <PostTitle>{post.content.title}</PostTitle>
              <PostContent
                dangerouslySetInnerHTML={{
                  __html: smartTrim(text, trimLength),
                }}
              />
            </BodyLink>
          </Link>
        </Body>
      </BodyBlock>
    );
  }

  renderRepostButton() {
    const { allowRepost } = this.props;

    if (allowRepost) {
      return (
        <>
          <Splitter />
          <RepostButton
            aria-label={tt('post_card.repost')}
            data-tooltip={tt('post_card.repost')}
            onClick={this.onRepostClick}
          >
            <RepostIcon />
          </RepostButton>
        </>
      );
    }
  }

  renderDetails() {
    const { post, author, repostAuthor, isRepost, router } = this.props;

    const firstTag = post.content?.tags?.[0];
    let category = null;
    let categoryUrl = null;

    if (firstTag) {
      category = detransliterate(firstTag);

      const asPath = router.asPath.replace(/\?.*$/, '');
      const currentFeed = !['/hot', '/trending'].includes(asPath) ? asPath : '/created';
      categoryUrl = `${currentFeed}?tags=${firstTag}`;
    }

    return (
      <DetailsBlock>
        {isRepost ? (
          <>
            <Link
              route="profile"
              params={{
                userId: repostAuthor || 'unknown',
              }}
            >
              <AuthorLink>
                <AuthorName>{repostAuthor?.username || 'unknown'}</AuthorName>
              </AuthorLink>
            </Link>
            <RepostArrowIcon />
          </>
        ) : null}
        <Link route="profile" params={{ userId: post.author || 'unknown' }} passHref>
          <AuthorLink>
            <AuthorName>{author?.username || post.author}</AuthorName>
            <AuthorRating>{repLog10(author?.stats?.reputation)}</AuthorRating>
          </AuthorLink>
        </Link>
        {category ? (
          <Link to={categoryUrl} passHref>
            <CategoryLink aria-label={tt('aria_label.category', { category })}>
              <CategoryLinkIn>{tt('g.in')}</CategoryLinkIn> {category}
            </CategoryLink>
          </Link>
        ) : null}
      </DetailsBlock>
    );
  }

  renderFooter() {
    const { post, isFavorite } = this.props;
    const { menu } = this.state;

    return (
      <Footer>
        <VotePanelCompact entity={post} splitter={Splitter} />
        <Splitter />
        <ReplyBlock mini count={post.stats.commentsCount} link={post.id} />
        {this.renderRepostButton()}
        <Filler />
        <MenuWrapper>
          {menu ? (
            <CompactPostCardMenu post={post} isFavorite={isFavorite} onClose={this.onMenuClose} />
          ) : null}
          <DotsIcon onClick={this.onMenuHandlerClick} />
        </MenuWrapper>
      </Footer>
    );
  }

  render() {
    const { hideNsfw, isHidden, post } = this.props;

    if (hideNsfw || isHidden || !post) {
      return null;
    }

    return (
      <Wrapper>
        {this.renderHeader()}
        <ContentWrapper>
          {this.renderBody()}
          {this.renderFooter()}
        </ContentWrapper>
      </Wrapper>
    );
  }
}
