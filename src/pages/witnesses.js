import React, { PureComponent } from 'react';

import { fetchLeaders } from 'store/actions/gate';
import Witnesses from 'components/witness/Witnesses';

export default class WitnessesPage extends PureComponent {
  static async getInitialProps({ store }) {
    try {
      await store.dispatch(fetchLeaders());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    return {};
  }

  render() {
    return <Witnesses />;
  }
}
