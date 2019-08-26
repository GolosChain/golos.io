import React, { PureComponent } from 'react';

import tt from 'counterpart';

import Navigation from 'components/common/Navigation';
import LeadersTop from 'components/leaders/LeadersTop';
import LeaderProposals from 'components/leaders/LeaderProposals';

const PAGES = {
  TOP: 'TOP',
  PROPOSALS: 'PROPOSALS',
};

export default class LeadersPage extends PureComponent {
  static async getInitialProps({ store, query }) {
    const page = query.subRoute === 'proposals' ? PAGES.PROPOSALS : PAGES.TOP;

    try {
      if (page === PAGES.TOP) {
        await LeadersTop.getInitialProps({ store });
      } else {
        await LeaderProposals.getInitialProps({ store });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('LeadersPage getInitialProps failed:', err);
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
            { text: tt('witnesses_jsx.tabs.leaders'), route: 'leaders' },
            {
              text: tt('witnesses_jsx.tabs.proposals'),
              route: 'leaders',
              params: { subRoute: 'proposals' },
            },
          ]}
        />
        {page === PAGES.TOP ? <LeadersTop /> : <LeaderProposals />}
      </div>
    );
  }
}
