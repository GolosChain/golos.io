import React, { Component } from 'react';
import { Router } from 'shared/routes';

export default class extends Component {
  static async getInitialProps({ asPath, res }) {
    let redirectUrl = '/leaders';
    const searchQuery = asPath.match(/\?.*$/);

    if (searchQuery) {
      redirectUrl += searchQuery[0];
    }

    if (res) {
      res.writeHead(301, { Location: redirectUrl });
      res.end();
    } else {
      Router.pushRoute(redirectUrl);
    }

    return {};
  }

  render() {
    return <div />;
  }
}
