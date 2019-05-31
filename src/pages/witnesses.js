import React, { PureComponent } from 'react';

import tt from 'counterpart';

import WitnessesTop from 'components/witness/WitnessesTop';
import WitnessProposals from 'components/witness/WitnessProposals';
import Navigation from '../components/common/Navigation';

const PAGES = {
  TOP: 'TOP',
  PROPOSALS: 'PROPOSALS',
};

export default class WitnessesPage extends PureComponent {
  static async getInitialProps({ store, asPath }) {
    const path = asPath.replace(/\?.*$/, '');

    const page = path.endsWith('/proposals') ? PAGES.PROPOSALS : PAGES.TOP;

    try {
      if (page === PAGES.TOP) {
        await WitnessesTop.getInitialProps({ store });
      } else {
        await WitnessProposals.getInitialProps({ store });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('WitnessesPage getInitialProps failed:', err);
    }

    return {
      page,
    };
  }

  render() {
    const { page } = this.props;

    return (
      <div>
        <Navigation
          tabLinks={[
            { text: tt('witnesses_jsx.tabs.leaders'), route: 'witnesses' },
            { text: tt('witnesses_jsx.tabs.proposals'), route: 'witnessesProposals' },
          ]}
        />
        {page === PAGES.TOP ? <WitnessesTop /> : <WitnessProposals />}
      </div>
    );
  }
}
