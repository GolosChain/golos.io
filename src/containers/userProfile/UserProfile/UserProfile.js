import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import Head from 'next/head';

import { blockedUsers, blockedUsersContent } from 'utils/IllegalContent';

import { listenLazy } from 'helpers/hoc';
import LoadingIndicator from 'components/elements/LoadingIndicator';
import BlockedContent from 'components/elements/BlockedContent';
import IllegalContentMessage from 'components/elements/IllegalContentMessage';
import Container from 'components/common/Container';
import UserHeader from 'components/userProfile/common/UserHeader';
import UserNavigation from 'components/userProfile/common/UserNavigation';
import UserCardAbout from 'components/userProfile/common/UserCardAbout';

const NAV_BAR_TYPES = {
  BIG: 1,
  SMALL: 2,
  MOBILE: 3,
};

const Main = styled(Container).attrs({
  align: 'flex-start',
  justify: 'center',
  small: 1,
})`
  padding: 20px 0;

  @media (max-width: 890px) {
    padding-top: 0;
    margin: 0 !important;
  }
`;

const WrapperMain = styled.div`
  background: #f9f9f9;

  @media (max-width: 890px) {
    background: #f3f3f3;
  }
`;

const Content = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  min-width: 280px;

  ${is('center')`
    flex-shrink: 0;
    flex-grow: 0;
  `};

  @media (max-width: 890px) {
    order: 4;
    max-width: none;
  }
`;

const SidebarLeft = styled.div`
  width: 273px;
  flex-shrink: 0;
  margin-right: 18px;

  @media (max-width: 890px) {
    width: 100%;
    margin-right: 0;
    order: 1;
  }
`;

const SmallUserNavigation = styled(UserNavigation)`
  order: 3;
`;

@listenLazy('resize')
export default class UserProfile extends Component {
  static propTypes = {
    fetching: PropTypes.bool,
    isOwner: PropTypes.bool,
    content: PropTypes.shape(),
    currentUser: PropTypes.shape(),
    profile: PropTypes.shape(),
  };

  static defaultProps = {
    fetching: false,
    isOwner: false,
    content: null,
    currentUser: null,
    profile: null,
  };

  state = {
    navBarType: NAV_BAR_TYPES.BIG,
  };

  componentDidMount() {
    this.onResize();
  }

  // calling by @listenLazy('resize')
  onResize() {
    const { navBarType: navBarTypeState } = this.state;
    const navBarType = UserProfile.getNavBarType();

    if (navBarTypeState !== navBarType) {
      this.setState({
        navBarType,
      });
    }
  }

  static getNavBarType() {
    const width = window.innerWidth;

    if (width <= 500) {
      return NAV_BAR_TYPES.MOBILE;
    }
    if (width <= 768) {
      return NAV_BAR_TYPES.SMALL;
    }
    return NAV_BAR_TYPES.BIG;
  }

  renderInner() {
    const {
      tabId,
      currentUser,
      profile,
      fetching,
      isOwner,
      followerCount,
      followingCount,
      uploadImage,
      updateAccount,
      notify,
      sidebar,
      content,
    } = this.props;
    const { navBarType } = this.state;

    if (!profile) {
      if (fetching) {
        return (
          <Main>
            <Content center>
              <LoadingIndicator type="circle" size={40} />
            </Content>
          </Main>
        );
      }
      return (
        <Main>
          <Content center>{tt('user_profile.unknown_account')}</Content>
        </Main>
      );
    }

    if (blockedUsers.includes(profile.username)) {
      return <IllegalContentMessage />;
    }

    if (blockedUsersContent.includes(profile.username)) {
      return <BlockedContent reason={tt('g.blocked_user_content')} />;
    }

    const showLayoutSwitcher = tabId === 'feed' || tabId === 'favorites';

    return (
      <>
        <UserHeader
          profile={profile}
          currentUser={currentUser}
          isOwner={isOwner}
          uploadImage={uploadImage}
          updateAccount={updateAccount}
          notify={notify}
          isSettingsPage={tabId === 'settings'}
        />
        {navBarType === NAV_BAR_TYPES.BIG ? (
          <UserNavigation
            userId={profile.userId}
            username={profile.username}
            isOwner={isOwner}
            showLayout={showLayoutSwitcher}
          />
        ) : null}
        <WrapperMain>
          <Main>
            {navBarType !== NAV_BAR_TYPES.BIG ? (
              <SmallUserNavigation
                userId={profile.userId}
                username={profile.username}
                isOwner={isOwner}
                isMobile={navBarType === NAV_BAR_TYPES.MOBILE}
                showLayout={showLayoutSwitcher}
              />
            ) : null}
            {tabId === 'settings' ? null : (
              <SidebarLeft>
                {tabId === 'wallet' ? null : (
                  <UserCardAbout
                    profile={profile}
                    followerCount={followerCount}
                    followingCount={followingCount}
                  />
                )}
                {sidebar}
              </SidebarLeft>
            )}
            <Content center={tabId === 'settings'}>{content}</Content>
          </Main>
        </WrapperMain>
      </>
    );
  }

  render() {
    const { profile } = this.props;

    return (
      <>
        <Head>
          <title>
            {profile
              ? tt('meta.title.profile.default', { name: profile.username })
              : tt('user_profile.unknown_account')}
          </title>
        </Head>
        {this.renderInner()}
      </>
    );
  }
}
