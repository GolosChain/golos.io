import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import ToastsManager from 'toasts-manager';
import { FormattedDate } from 'react-intl';

import { Link } from 'shared/routes';
import { profileType } from 'types/common';
import { makeSocialLink, sanitizeUrl } from 'helpers/urls';

import Icon from 'components/golos-ui/Icon';
import { CardTitle } from 'components/golos-ui/Card';
import CollapsingCard from 'components/golos-ui/CollapsingCard';

import DialogManager from 'components/elements/common/DialogManager';
import FollowersDialog from 'components/dialogs/FollowersDialog';
import UserStatus from '../UserStatus';

const CollapsingCardStyled = styled(CollapsingCard)`
  margin-bottom: 18px;
  border-radius: 8px;

  @media (max-width: 890px) {
    border-radius: 0;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px 17px 20px;
`;

const CardContentCounters = styled(CardContent)`
  margin: 0;
`;

const Row = styled.div`
  position: relative;
  display: flex;

  &:not(:last-of-type) {
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: #e1e1e1;
    }
  }
`;

const SizedRow = styled(Row)`
  height: 70px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;

  &:first-of-type {
    margin-right: -1px;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 1px;
      background: #e1e1e1;
    }
  }
`;

const ColumnLink = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ColumnClick = styled(Column).attrs({ as: 'button', type: 'button' })`
  cursor: pointer;
`;

const Bold = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 17px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 5px;
`;

const Title = styled.div`
  color: #393636;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  font-weight: 300;
  line-height: 1;
`;

const LocationIcon = styled(Icon)`
  flex-shrink: 0;
  width: 14px;
  height: 18px;
  margin: 0 6px;
`;

const UserCardCityWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UserCardCity = styled.div`
  color: #393636;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 13px;
  font-weight: 400;
  line-height: 1;
  text-transform: initial;
`;

const UserCardSite = styled.a`
  color: #2879ff;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  letter-spacing: 0.25px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: underline;
  text-transform: initial;
`;

const UserCardBio = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: #7d7d7d;
`;

const SocialBlock = styled(CardTitle)`
  justify-content: space-around;
  padding: 0 8px;
`;

const UserInfoTitle = styled(CardTitle)`
  border-bottom: 0;
`;

const SocialLink = styled.a`
  display: block;
  padding: 0 10px;
  color: #333;

  ${is('fb')`
    padding-left: 14px;
    padding-right: 6px;
  `};
`;

const IconStyled = styled(Icon)`
  display: block;
`;

const IconTriangle = styled(Icon).attrs({
  name: 'triangle',
})`
  width: 4.2px;
  height: 2.8px;
  margin: 0 -8.4px 0 3px;
`;

export default class UserCardAbout extends PureComponent {
  static propTypes = {
    profile: profileType.isRequired,
  };

  onShowFollowers = () => {
    const { profile } = this.props;

    DialogManager.showDialog({
      component: FollowersDialog,
      props: {
        userId: profile.userId,
        type: 'followers',
      },
    });
  };

  onShowFollowing = () => {
    const { profile } = this.props;

    DialogManager.showDialog({
      component: FollowersDialog,
      props: {
        userId: profile.userId,
        type: 'following',
      },
    });
  };

  renderFollowingRow() {
    const { profile } = this.props;

    const followingCount = profile?.subscriptions?.usersCount || 0;
    const followerCount = profile?.subscribers?.usersCount || 0;

    return (
      <SizedRow>
        <ColumnClick
          name="user-info__followers-quantity"
          aria-label={tt('aria_label.followers')}
          onClick={followerCount ? this.onShowFollowers : null}
        >
          <Bold>
            {followerCount} {followerCount ? <IconTriangle /> : null}
          </Bold>
          <Title>{tt('user_profile.account_summary.followers', { count: followerCount })}</Title>
        </ColumnClick>
        <ColumnClick
          name="user-info__following-quantity"
          aria-label={tt('aria_label.following')}
          onClick={followingCount ? this.onShowFollowing : null}
        >
          <Bold>
            {followingCount} {followingCount ? <IconTriangle /> : null}
          </Bold>
          <Title>{tt('user_profile.account_summary.following', { count: followingCount })}</Title>
        </ColumnClick>
      </SizedRow>
    );
  }

  renderStatsRow() {
    const { profile } = this.props;

    let { postsCount, commentsCount } = profile.stats;
    postsCount = postsCount || 0;
    commentsCount = commentsCount || 0;

    return (
      <SizedRow>
        <Column>
          <Link route="profile" params={{ userId: profile.userId }} passHref>
            <ColumnLink>
              <Bold>{postsCount}</Bold>
              <Title>
                {tt('user_profile.account_summary.post_count', {
                  count: postsCount,
                })}
              </Title>
            </ColumnLink>
          </Link>
        </Column>
        <Column>
          <Link
            route="profileSection"
            params={{ userId: profile.userId, section: 'comments' }}
            passHref
          >
            <ColumnLink>
              <Bold>{commentsCount}</Bold>
              <Title>
                {tt('user_profile.account_summary.comment_count', {
                  count: commentsCount,
                })}
              </Title>
            </ColumnLink>
          </Link>
        </Column>
      </SizedRow>
    );
  }

  renderOthersRow() {
    const { profile } = this.props;
    const gender = profile.personal?.gender;

    const localizedGender = {
      male: tt('g.gender.male'),
      female: tt('g.gender.female'),
    };

    if (!localizedGender[gender] && !profile.created) {
      return null;
    }

    return (
      <SizedRow>
        {localizedGender[gender] ? (
          <Column>
            <Title>
              {localizedGender[gender]} {tt('user_profile.account_summary.gender')}
            </Title>
          </Column>
        ) : null}
        {profile.created ? (
          <Column>
            <Title>
              {tt('user_profile.account_summary.registered')}{' '}
              <FormattedDate value={profile.registration.time} year="numeric" month="numeric" />
            </Title>
          </Column>
        ) : null}
      </SizedRow>
    );
  }

  renderLocationBlock() {
    const { profile } = this.props;

    const location = profile.personal?.location;
    const website = profile.personal?.website;

    if (!website && !location) {
      return null;
    }

    let websiteLabel = null;

    if (website) {
      websiteLabel = website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    }

    return (
      <UserInfoTitle justify="space-between">
        {website && <UserCardSite href={sanitizeUrl(website)}>{websiteLabel}</UserCardSite>}
        <UserCardCityWrapper>
          <LocationIcon name="location" />
          {location && <UserCardCity>{location}</UserCardCity>}
          <IconTriangle />
        </UserCardCityWrapper>
      </UserInfoTitle>
    );
  }

  renderSocialBlock() {
    const { profile } = this.props;
    const { contacts } = profile.personal;

    if (!contacts || Object.keys(contacts).length === 0) {
      return null;
    }

    return (
      <SocialBlock justify="space-between">
        {contacts.facebook && (
          <SocialLink
            href={makeSocialLink(contacts.facebook, 'https://facebook.com/')}
            fb={1}
            target="_blank"
          >
            <IconStyled name="facebook" width="13" height="24" />
          </SocialLink>
        )}
        {contacts.vkontakte && (
          <SocialLink href={makeSocialLink(contacts.vkontakte, 'https://vk.com/')} target="_blank">
            <IconStyled name="vk" width="28" height="18" />
          </SocialLink>
        )}
        {contacts.instagram && (
          <SocialLink
            href={makeSocialLink(contacts.instagram, 'https://instagram.com/')}
            target="_blank"
          >
            <IconStyled name="instagram" size="23" />
          </SocialLink>
        )}
        {contacts.twitter && (
          <SocialLink
            href={makeSocialLink(contacts.twitter, 'https://twitter.com/')}
            target="_blank"
          >
            <IconStyled name="twitter" width="26" height="22" />
          </SocialLink>
        )}
      </SocialBlock>
    );
  }

  render() {
    const { profile } = this.props;
    const about = profile.personal?.about;

    return (
      <CollapsingCardStyled title={tt('user_profile.account_summary.title')} saveStateKey="info">
        <CardContentCounters>
          <Row>
            <UserStatus profile={profile} />
          </Row>
          {this.renderFollowingRow()}
          {this.renderStatsRow()}
          {this.renderOthersRow()}
        </CardContentCounters>
        {this.renderLocationBlock()}
        {about && (
          <CardContent>
            <UserCardBio>{about}</UserCardBio>
          </CardContent>
        )}
        {this.renderSocialBlock()}
      </CollapsingCardStyled>
    );
  }
}
