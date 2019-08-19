import React, { PureComponent } from 'react';
import { withRouter } from 'next/router';

import { fetchProfile, getBalance } from 'store/actions/gate';
import withTabs from 'utils/hocs/withTabs';

import UserProfile from 'containers/userProfile/UserProfile';
import BlogContent from 'containers/userProfile/blog';
import CommentsContent from 'containers/userProfile/comments';
import ActivityContent from 'containers/userProfile/activity';
import SidebarRight from 'components/userProfile/common/RightPanel';
// dynamic(() => import('containers/userProfile/settings/SettingsContent'))
import SettingsContent from 'containers/userProfile/settings/SettingsContent';
import RepliesContent from 'containers/userProfile/replies';
import FavoritesContent from 'containers/userProfile/favorites/index'; // doesn't work without index
import WalletContent from 'containers/userProfile/wallet/WalletContent';

const TABS = {
  feed: {
    tabName: 'Feed',
    route: 'profile',
    index: true,
    Component: BlogContent,
  },
  comments: {
    tabName: 'Comments',
    route: 'profileSection',
    Component: CommentsContent,
  },
  replies: {
    tabName: 'Replies',
    route: 'profileSection',
    Component: RepliesContent,
  },
  favorites: {
    tabName: 'Favorites',
    route: 'profileSection',
    Component: FavoritesContent,
  },
  wallet: {
    tabName: 'Wallet',
    route: 'profileSection',
    Component: WalletContent,
  },
  activity: {
    tabName: 'Activity',
    route: 'profileSection',
    Component: ActivityContent,
  },
  subscriptions: {
    tabName: 'Subscriptions',
    route: 'profileSection',
    Component: () => <div>Subscriptions Mock</div>,
  },
  settings: {
    tabName: 'Settings',
    route: 'profileSection',
    Component: SettingsContent,
  },
};

@withRouter
@withTabs(TABS, 'feed')
export default class Profile extends PureComponent {
  static async getInitialProps(ctx) {
    const { store, query } = ctx;

    let user = {};

    try {
      user = await store.dispatch(fetchProfile(query.userId));
      await store.dispatch(getBalance(user.userId));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Profile [${query.userId}] not found`);
    }

    return {
      userId: user.userId,
    };
  }

  render() {
    const { userId, tab, tabId, tabProps, router } = this.props;
    const { query } = router;

    const sections = [query.section2, query.section3, query.section4];

    return (
      <UserProfile
        userId={userId}
        tabId={tabId}
        content={<tab.Component userId={userId} sections={sections} {...tabProps} />}
        sidebar={<SidebarRight userId={userId} />}
      />
    );
  }
}
