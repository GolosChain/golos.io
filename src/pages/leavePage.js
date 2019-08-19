import React, { Component } from 'react';

import LeavePage from 'components/pages/LeavePage';

export default class extends Component {
  static async getInitialProps({ query }) {
    return {
      target: query.target,
    };
  }

  render() {
    const { target } = this.props;
    return <LeavePage target={target} />;
  }
}
