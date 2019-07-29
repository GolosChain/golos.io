import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import tt from 'counterpart';

import { Link } from 'shared/routes';
import Icon from 'components/golos-ui/Icon';
import LayoutSwitcher from 'components/common/LayoutSwitcher';
import Navigation from 'components/common/Navigation';
import NavigationMobile from 'components/common/NavigationMobile';

const SettingsLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  color: #393636;

  &:hover {
    color: #2879ff;
  }
`;

const GearIcon = styled(Icon).attrs({ name: 'gear' })`
  width: 17px;
  height: 17px;
`;

@withRouter
export default class UserNavigation extends PureComponent {
  static propTypes = {
    username: PropTypes.string.isRequired,
    isOwner: PropTypes.bool,
    isMobile: PropTypes.bool,
    showLayout: PropTypes.bool,
  };

  render() {
    const { username, router, isOwner, isMobile, showLayout, className } = this.props;

    const tabLinks = [];
    const rightItems = [];

    tabLinks.push(
      { text: tt('g.blog'), route: 'profile', params: { username } },
      {
        text: tt('g.comments'),
        route: 'profileSection',
        params: { username, section: 'comments' },
      },
      {
        text: tt('g.replies'),
        route: 'profileSection',
        params: { username, section: 'replies' },
      }
    );

    if (isOwner) {
      tabLinks.push({
        text: tt('g.favorites'),
        route: 'profileSection',
        params: { username, section: 'favorites' },
      });
    }

    tabLinks.push({
      text: tt('g.wallet'),
      route: 'profileSection',
      params: { username, section: 'wallet' },
    });

    if (isOwner) {
      tabLinks.push({
        text: tt('g.activity'),
        route: 'profileSection',
        params: { username, section: 'activity' },
      });

      if (isMobile) {
        rightItems.push(
          <Link
            key="settings"
            route="profileSection"
            params={{ username, section: 'settings' }}
            passHref
          >
            <SettingsLink>
              <GearIcon />
            </SettingsLink>
          </Link>
        );
      } else {
        tabLinks.push({
          text: tt('g.settings'),
          route: 'profileSection',
          params: { username, section: 'settings' },
        });
      }
    }

    if (showLayout) {
      rightItems.push(<LayoutSwitcher key="layout" mobile={isMobile} />);
    }

    const rightFragment = rightItems.length ? <>{rightItems}</> : null;

    if (isMobile) {
      return (
        <NavigationMobile
          asPath={router.asPath}
          tabLinks={tabLinks}
          rightItems={rightFragment}
          className={className}
        />
      );
    }

    return (
      <Navigation tabLinks={tabLinks} compact rightItems={rightFragment} className={className} />
    );
  }
}
