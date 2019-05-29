import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';
import PropTypes from 'prop-types';

import { Link } from 'shared/routes';
import Icon from 'components/golos-ui/Icon';
// import { ButtonBlock } from 'components/golos-ui/Button';
import { TagLink } from 'components/golos-ui/Tag';

import Userpic from 'components/common/Userpic';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import PopoverBody from 'containers/post/PopoverBody';
import {
  AvatarBox,
  PopoverBackgroundShade,
  PopoverStyled,
} from 'components/post/PopoverAdditionalStyles';
import PostActions from 'components/post/PostActions';
// import FollowUserButton from 'components/common/FollowUserButton';

const Wrapper = styled.div`
  position: relative;
  padding: 0 70px 25px;

  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto auto 1fr auto auto auto;
  grid-template-areas: 'author follow . promoted category actions';

  @media (max-width: 768px) {
    grid-template-rows: auto auto;
    grid-template-columns: auto auto auto 1fr auto auto;
    grid-template-areas:
      'author author follow . . actions'
      'category . . . promoted promoted';
    grid-row-gap: 25px;
  }

  @media (max-width: 576px) {
    padding: 0 20px 15px;
  }
`;

const ALink = styled(({ route, children, ...props }) => (
  <Link route={route} passHref>
    <a {...props}>{children}</a>
  </Link>
))``;

const Avatar = styled(({ route, ...props }) =>
  route ? (
    <ALink route={route} {...props} />
  ) : (
    <button type="button" name="card-author__open-popover" {...props} />
  )
)`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer !important;
`;

const InfoBlock = styled.div`
  display: block;
  margin: 0 10px;
  letter-spacing: 0.4px;
  line-height: 18px;

  span {
    display: block;
    color: #959595;
    font: 13px Roboto, sans-serif;
  }

  @media (max-width: 576px) {
    font-size: 12px;
  }
`;

const AuthorName = styled.div`
  display: inline-block;
  padding: 5px 10px;
  margin: -5px 0 0 -10px;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  color: #333;
  text-decoration: none;

  @media (max-width: 576px) {
    font-size: 14px;
  }
`;

// const CustomIcon = styled(Icon)`
//   min-width: 12px;
//   min-height: 12px;
//   flex-shrink: 0;
// `;

// const FollowedIcon = styled(CustomIcon)`
//   margin: 1px 0 0 1px;
// `;

// const FollowButtonWrapper = styled(FollowUserButton)`
//   margin-left: 30px;

//   grid-area: follow;
//   align-self: center;
// `;

// const FollowRound = styled(ButtonBlock)`
//   width: 34px;
//   height: 34px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border-radius: 50%;
//   cursor: pointer;
// `;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  outline: none;

  grid-area: author;
`;

const UserpicStyled = styled(Userpic)`
  display: block;

  @media (max-width: 576px) {
    width: 38px !important;
    height: 38px !important;
  }
`;

const PostActionsWrapper = styled.div`
  display: flex;

  grid-area: actions;
  align-self: center;
`;

const PostActionsStyled = styled(PostActions)`
  height: 34px;
  padding: 5px;
  margin: 0 3px;
`;

const PromotedMark = styled.div`
  position: relative;
  display: flex;
  grid-area: promoted;
  align-self: center;
  margin: 0 18px;

  &::after {
    content: '';
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    z-index: 1;
    width: 14px;
    height: 17px;
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 768px) {
    justify-self: end;
    max-width: 34px;
    margin-right: 0;
  }
`;

const PromotedIcon = styled(Icon)`
  position: relative;
  z-index: 2;
  min-width: 34px;
  min-height: 37px;
`;

const Category = styled(TagLink)`
  grid-area: category;
  align-self: center;
  margin: 0 3px;
`;

export default class PostHeader extends Component {
  static propTypes = {
    post: PropTypes.shape({}).isRequired,
    author: PropTypes.shape({}).isRequired,
    authorProfile: PropTypes.shape({}),
    forwardRef: PropTypes.shape({
      current: PropTypes.any,
    }),
    isPinned: PropTypes.bool,
    isOwner: PropTypes.bool,
    isFavorite: PropTypes.bool,
    isEdit: PropTypes.bool,
    isPromoted: PropTypes.bool,
  };

  static defaultProps = {
    authorProfile: null,
    forwardRef: null,
    isPinned: false,
    isOwner: false,
    isFavorite: false,
    isEdit: false,
    isPromoted: false,
  };

  closePopoverTs = 0;

  state = {
    showPopover: false,
  };

  onUserInfoClick = e => {
    e.preventDefault();
    e.stopPropagation();

    if (Date.now() > this.closePopoverTs + 200) {
      this.setState({
        showPopover: true,
      });
    }
  };

  closePopover = () => {
    this.closePopoverTs = Date.now();

    this.setState({
      showPopover: false,
    });
  };

  render() {
    const {
      post,
      author,
      authorProfile,
      forwardRef,
      isPinned,
      isOwner,
      isFavorite,
      isEdit,
      isPromoted,
      className,
    } = this.props;
    const { showPopover } = this.state;
    const { meta, content } = post;
    const category = content?.metadata?.tags?.[0] || null;

    return (
      <Wrapper ref={forwardRef} className={className}>
        <UserInfoWrapper>
          {authorProfile ? (
            <Avatar aria-label={tt('aria_label.avatar')} onClick={this.onUserInfoClick}>
              <UserpicStyled userId={author?.id} size={50} />
              {showPopover && (
                <>
                  <PopoverBackgroundShade show={showPopover} />
                  <AvatarBox popoverOffsetTop={50} userPicSize={50}>
                    <PopoverStyled closePopover={this.closePopover} show>
                      <PopoverBody userId={author?.id} closePopover={this.closePopover} />
                    </PopoverStyled>
                  </AvatarBox>
                </>
              )}
            </Avatar>
          ) : (
            <Avatar route={`/@${author?.id}`} aria-label={tt('aria_label.avatar')}>
              <UserpicStyled userId={author?.id} size={50} />
            </Avatar>
          )}
          <InfoBlock>
            <AuthorName aria-label={tt('aria_label.username')}>{author.username}</AuthorName>
            <TimeAgoWrapper date={meta.time} />
          </InfoBlock>
        </UserInfoWrapper>
        {/* {!isOwner && (
          <FollowButtonWrapper
            FollowComp={
              <FollowRound>
                <CustomIcon name="plus" width={12} height={12} />
              </FollowRound>
            }
            UnfollowComp={
              <FollowRound light>
                <FollowedIcon name="tick" width={18} height={14} />
              </FollowRound>
            }
            targetUser={author}
          />
        )} */}
        {isPromoted && (
          <PromotedMark>
            <PromotedIcon name="best" width="34" height="37" />
          </PromotedMark>
        )}
        {category && (
          <Category
            route={`/created?tags=${category}`}
            category={1}
            aria-label={tt('aria_label.category', { category })}
            passHref
          >
            {category}
          </Category>
        )}
        <PostActionsWrapper>
          <PostActionsStyled
            fullUrl={post.id}
            isFavorite={isFavorite}
            isPinned={isPinned}
            isEdit={isEdit}
            isOwner={isOwner}
          />
        </PostActionsWrapper>
      </Wrapper>
    );
  }
}
