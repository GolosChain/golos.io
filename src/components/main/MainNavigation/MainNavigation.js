/* eslint-disable import/no-named-as-default */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Navigation from 'components/common/Navigation';
import LayoutSwitcher from 'components/common/LayoutSwitcher';
import NavigationMobile from 'components/common/NavigationMobile';

const MobileWrapper = styled.div`
  border-top: 1px solid #e1e1e1;
`;

export default class MainNavigation extends PureComponent {
  static propTypes = {
    loggedUserId: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    router: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    loggedUserId: null,
  };

  render() {
    const { loggedUserId, isMobile, className, router } = this.props;

    const tabLinks = [];

    if (loggedUserId) {
      tabLinks.push({
        text: tt('header_jsx.home'),
        route: 'feed',
        params: {
          userId: loggedUserId,
        },
      });
    }

    tabLinks.push(
      { text: tt('g.new'), route: 'created' },
      { text: tt('main_menu.hot'), route: 'hot' },
      { text: tt('main_menu.trending'), route: 'trending', includeRoute: '/', index: true }
    );

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
