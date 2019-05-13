import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HomeContainer from 'containers/home/HomeContainer';
import HomeContent from 'containers/home/content';
import HomeSidebar from 'containers/home/sidebar';

export default class Feed extends PureComponent {
  static propTypes = {
    contentProps: PropTypes.shape({}).isRequired,
    sidebarProps: PropTypes.shape({}).isRequired,
  };

  static async getInitialProps(ctx) {
    const [contentProps, sidebarProps] = await Promise.all([
      HomeContent.getInitialProps(ctx),
      HomeSidebar.getInitialProps(ctx),
    ]);

    return {
      contentProps,
      sidebarProps,
    };
  }

  render() {
    const { contentProps, sidebarProps } = this.props;

    return (
      <HomeContainer
        content={<HomeContent {...contentProps} />}
        sidebar={<HomeSidebar {...sidebarProps} />}
      />
    );
  }
}
