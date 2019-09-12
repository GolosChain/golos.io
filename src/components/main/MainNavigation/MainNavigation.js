/* eslint-disable import/no-named-as-default */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { withRouter } from 'next/router';

import Navigation from 'components/common/Navigation';
import LayoutSwitcher from 'components/common/LayoutSwitcher';
import NavigationMobile from 'components/common/NavigationMobile';

const MobileWrapper = styled.div`
  border-top: 1px solid #e1e1e1;
`;

@withRouter
export default class MainNavigation extends PureComponent {
  static propTypes = {
    userId: PropTypes.string,
    username: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    router: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    userId: null,
    username: null,
  };

  computeTabLinks() {
    const {
      userId,
      username,
      router: {
        query: { tags },
      },
    } = this.props;

    const tabLinks = [];

    const params = tags ? { tags } : {};

    if (userId) {
      tabLinks.push({
        text: tt('header_jsx.home'),
        route: 'feed',
        params: {
          userId,
          username,
          ...params,
        },
      });
    }

    tabLinks.push(
      { text: tt('g.new'), route: 'created', params },
      { text: tt('main_menu.hot'), route: 'hot', params },
      {
        text: tt('main_menu.trending'),
        route: 'trending',
        params,
        includeRoute: '/',
        includeSubRoutes: true,
      }
    );

    return tabLinks;
  }

  render() {
    const { isMobile, className, router } = this.props;

    const tabLinks = this.computeTabLinks();

    if (isMobile) {
      return (
        <MobileWrapper>
          <NavigationMobile
            asPath={router.asPath}
            tabLinks={tabLinks}
            rightItems={<LayoutSwitcher mobile />}
            className={className}
          />
        </MobileWrapper>
      );
    }

    return <Navigation tabLinks={tabLinks} rightItems={<LayoutSwitcher />} className={className} />;
  }
}
