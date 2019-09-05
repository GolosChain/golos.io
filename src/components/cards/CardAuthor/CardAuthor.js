import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import { profileType } from 'types/common';
import Icon from 'components/golos-ui/Icon';
import Userpic from 'components/common/Userpic';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import SmartLink from 'components/common/SmartLink';

import {
  AvatarBox,
  PopoverBackgroundShade,
  PopoverStyled,
} from 'components/post/PopoverAdditionalStyles';
import PopoverBody from 'containers/post/PopoverBody';

const USER_PIC_SIZE = 37;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  margin-right: 18px;
`;

const ALink = styled(({ route, params, children, ...props }) => (
  <SmartLink route={route} params={params}>
    <a {...props}>{children}</a>
  </SmartLink>
))`
  cursor: pointer;
`;

const Avatar = styled(({ route, ...props }) =>
  route ? (
    <ALink route={route} {...props} />
  ) : (
    <button type="button" name="card-author__open-popover" {...props} />
  )
)`
  position: relative;
  display: flex;
  margin-right: 10px;
  border-radius: 50%;
  cursor: pointer;
`;

const PostDesc = styled.div`
  font-family: ${({ theme }) => theme.fontFamily};
`;

const AuthorLine = styled.div`
  margin-bottom: 3px;
  line-height: 1.1;
`;

const AuthorName = styled(({ route, ...props }) =>
  route ? <ALink route={route} {...props} /> : <span {...props} />
)`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
`;

const PostDate = styled(({ route, ...props }) =>
  route ? <ALink route={route} {...props} /> : <span {...props} />
)`
  display: block;
  font-size: 13px;
  letter-spacing: 0.4px;
  line-height: 1.5;
  white-space: nowrap;
  color: #959595;

  &:hover,
  &:focus {
    color: #8b8989;
  }
`;

const RepostIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: -6px;
  left: -6px;
  width: 20px;
  height: 20px;

  border-radius: 50%;
  background-color: #fff;
`;

const RepostIcon = styled(Icon)`
  flex-shrink: 0;
  color: #2879ff;
`;

export default class CardAuthor extends Component {
  static propTypes = {
    author: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    profile: profileType,
    contentLink: PropTypes.string,
    popoverOffsetTop: PropTypes.number,
    contentId: PropTypes.shape({}),
    isRepost: PropTypes.bool,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    noLinks: PropTypes.bool,
    commentInPost: PropTypes.bool,
    infoPopover: PropTypes.bool,
  };

  static defaultProps = {
    contentLink: null,
    popoverOffsetTop: 52,
    contentId: null,
    isRepost: false,
    created: '',
    noLinks: false,
    commentInPost: false,
    infoPopover: false,
    profile: null,
  };

  closePopoverTs = 0;

  state = {
    showPopover: false,
  };

  openPopover = e => {
    const { infoPopover, commentInPost } = this.props;
    if (!infoPopover) {
      return;
    }

    e.preventDefault();
    if (commentInPost) {
      e.stopPropagation();
    }
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

  renderPopover() {
    const { popoverOffsetTop, author, profile } = this.props;
    const { showPopover } = this.state;

    return showPopover && profile ? (
      <>
        <PopoverBackgroundShade show={showPopover} />
        <AvatarBox popoverOffsetTop={popoverOffsetTop} userPicSize={USER_PIC_SIZE}>
          <PopoverStyled closePopover={this.closePopover} show>
            <PopoverBody userId={author.userId} closePopover={this.closePopover} />
          </PopoverStyled>
        </AvatarBox>
      </>
    ) : null;
  }

  render() {
    const {
      contentId,
      author,
      isRepost,
      created,
      noLinks,
      commentInPost,
      className,
      profile,
    } = this.props;

    let profileLinkProps = null;

    if (!noLinks && author) {
      profileLinkProps = {
        route: 'profile',
        params: {
          userId: author.userId,
          username: author.username,
        },
      };
    }

    let postLinkProps = null;

    if (!commentInPost && !noLinks) {
      postLinkProps = {
        route: 'post',
        params: {
          ...contentId,
          username: author.username,
        },
      };
    }

    return (
      <>
        <Wrapper className={className}>
          {profile ? (
            <Avatar aria-label={tt('aria_label.avatar')} onClick={this.openPopover}>
              <Userpic userId={author?.userId} size={USER_PIC_SIZE} />
              {this.renderPopover()}
              {isRepost ? (
                <RepostIconWrapper>
                  <RepostIcon name="repost" width={14} height={12} />
                </RepostIconWrapper>
              ) : null}
            </Avatar>
          ) : (
            <Avatar {...profileLinkProps} aria-label={tt('aria_label.avatar')}>
              <Userpic userId={author?.userId} size={USER_PIC_SIZE} />
              {isRepost ? (
                <RepostIconWrapper>
                  <RepostIcon name="repost" width={14} height={12} />
                </RepostIconWrapper>
              ) : null}
            </Avatar>
          )}
          <PostDesc>
            <AuthorLine>
              <AuthorName {...profileLinkProps}>{author?.username}</AuthorName>
            </AuthorLine>
            <PostDate {...postLinkProps}>
              <TimeAgoWrapper date={created} />
            </PostDate>
          </PostDesc>
        </Wrapper>
      </>
    );
  }
}
