import React, { PureComponent } from 'react';

import { fetchLeaders } from 'store/actions/gate';
import Witnesses from 'containers/witnesses/Witnesses';

export default class WitnessesPage extends PureComponent {
  static async getInitialProps({ store }) {
    try {
      await store.dispatch(fetchLeaders());
    } catch (err) {
      console.error(err);
    }

    return {};
  }

  render() {
    return <Witnesses />;
  }
}
