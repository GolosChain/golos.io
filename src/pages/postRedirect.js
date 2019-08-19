import React, { Component } from 'react';
import { Router } from 'shared/routes';

export default class extends Component {
  static async getInitialProps({ query, req, res }) {
    const searchQuery = req.url.match(/\?.*$/);

    let redirectUrl = `/@${query.userId}/${query.permlink}`;

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
