import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import { Link } from 'shared/routes';

import Icon from 'components/golos-ui/Icon';

import { breakWordStyles } from 'helpers/styles';
import { repLog10 } from 'utils/ParsersAndFormatters';

import Userpic from 'components/common/Userpic';
import { ClosePopoverButton } from 'components/post/PopoverAdditionalStyles';
import Mute from 'components/common/Mute';
import Follow from 'components/common/Follow';
import UserStatus from 'components/userProfile/common/UserStatus';

const USER_ICON_SIZE = 50;

const Block = styled.div`
  width: 100%;
  border-bottom: 2px solid #e1e1e1;
  padding: 20px 0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ButtonsBlock = styled(Block)`
  display: flex;
  justify-content: space-between;
`;

const Wrapper = styled.section`
  min-width: 300px;
  max-width: 100%;
  position: relative;
  padding: 8px 20px 20px;

  & ${Block}:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (max-width: 768px) {
    min-width: 330px;
    background: #fff;
    border-radius: 7px;
  }
`;

const AuthorTitle = styled.div`
  display: flex;
  padding-right: 20px;
`;

const AuthorInfoBlock = styled.a`
  display: block;
  padding-right: 12px;
  margin-right: auto;
`;

const AuthorName = styled.div`
  color: #393636;
  font-family: 'Open Sans', sans-serif;
  font-size: 24px;
  font-weight: bold;
  line-height: 25px;
`;

const AuthorAccount = styled.div`
  display: inline-block;
  padding: 0 10px;
  margin-left: -10px;
  color: #959595;
  font: 13px Roboto, sans-serif;
  letter-spacing: 0.4px;
  text-decoration: none;
  line-height: 25px;
`;

const About = styled.p`
  padding: 20px 0;
  font: 16px 'Open Sans', sans-serif;
  letter-spacing: -0.26px;
  line-height: 24px;
  color: #959595;
`;

const Followers = styled.div``;

const AvatarLink = styled.a`
  position: relative;
  display: flex;
  width: ${USER_ICON_SIZE}px;
  height: ${USER_ICON_SIZE}px;
  border-radius: 50%;

  &::after {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    content: '${props => props.rating}';
    bottom: 0;
    right: 0;
    width: 24px;
    height: 24px;
    border-radius: 100px;
    background-color: #fff;
    font-size: 10px;
    font-weight: bold;
    color: #2879ff;
    transform: translate(30%, 40%);
  }
`;

const PinnedPost = styled.div`
  display: flex;
  margin-top: 20px;
`;

const PinnedIcon = styled(Icon)`
  width: 20px;
  flex-shrink: 0;
`;

const PostsTitle = styled.div`
  color: #393636;
  font: 14px 'Open Sans', sans-serif;
  font-weight: 600;
  line-height: 16px;
  flex-shrink: 1;
  text-transform: uppercase;
`;

const PostTitle = styled(Link)`
  margin-left: 12px;
  color: #333;
  font: 16px Roboto, sans-serif;
  font-weight: 500;
  line-height: 24px;
  text-decoration: none;
  ${breakWordStyles};

  &:visited,
  &:hover,
  &:active {
    color: #333;
  }
`;

// Follow has undefined value at first time component mounting
const FollowButton = styled(props => <Follow {...props} />)`
  min-width: 150px;
  min-height: 30px;
`;

const MuteButton = styled(Mute)`
  min-width: 130px;
  min-height: 30px;
  margin-left: 10px;
`;

export default class PopoverBody extends Component {
  static propTypes = {
    closePopover: PropTypes.func,
  };

  componentDidMount() {
    const { pinnedPostsUrls, closePopover, getPostContent, profile } = this.props;
    if (pinnedPostsUrls) {
      getPostContent(pinnedPostsUrls);
    }

    if (!profile && closePopover) {
      closePopover();
    }
  }

  render() {
    const { profile, pinnedPosts, showFollowBlock, closePopover, className } = this.props;

    if (!profile) {
      return null;
    }

    const { userId, username, personal, subscribers, stats } = profile;

    let reputation = 0;

    if (stats?.reputation) {
      reputation = repLog10(stats.reputation);
    }

    const profileId = username || userId;

    return (
      <Wrapper className={className}>
        <ClosePopoverButton aria-label={tt('aria_label.close_button')} onClick={closePopover}>
          <Icon name="cross" width={16} height={16} />
        </ClosePopoverButton>
        <Block>
          <AuthorTitle>
            <Link route="profile" params={{ userId: profileId }} passHref>
              <AuthorInfoBlock>
                <AuthorName>{personal.name || profileId}</AuthorName>
                <AuthorAccount aria-label={tt('aria_label.username')}>@{profileId}</AuthorAccount>
              </AuthorInfoBlock>
            </Link>
            <Link route="profile" params={{ userId: profileId }} passHref>
              <AvatarLink aria-label={tt('aria_label.avatar')} rating={reputation}>
                <Userpic userId={userId} size={USER_ICON_SIZE} />
              </AvatarLink>
            </Link>
          </AuthorTitle>
          <UserStatus profile={profile} popover />
          {Boolean(personal.about) && <About>{personal.about}</About>}
          <Followers>
            {tt('user_profile.followers_count', { count: subscribers.usersCount })}
          </Followers>
        </Block>
        {pinnedPosts.length > 0 && (
          <Block>
            <PostsTitle>{tt('g.authors_posts')}</PostsTitle>
            {pinnedPosts.map(post => (
              <PinnedPost key={post.url}>
                <PinnedIcon name="pin" />
                <PostTitle to={post.url}>{post.title}</PostTitle>
              </PinnedPost>
            ))}
          </Block>
        )}
        {/*{showFollowBlock && (
          <ButtonsBlock>
            <FollowButton userId={userId} onClick={this.closePopover} />
            <MuteButton role="button" muting={userId} onClick={this.closePopover} />
          </ButtonsBlock>
        )}*/}
      </Wrapper>
    );
  }
}
