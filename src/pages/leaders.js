import React, { PureComponent } from 'react';

import tt from 'counterpart';

import Navigation from 'components/common/Navigation';
import LeadersTop from 'components/leaders/LeadersTop';
import LeaderProposals from 'components/leaders/LeaderProposals';
import ProposalPage from 'components/leaders/ProposalPage';

const PAGES = {
  TOP: 'TOP',
  PROPOSALS: 'PROPOSALS',
};

export default class LeadersPage extends PureComponent {
  static async getInitialProps({ store, query }) {
    const page = query.subRoute === 'proposals' ? PAGES.PROPOSALS : PAGES.TOP;
    let passProps;

    try {
      if (page === PAGES.TOP) {
        passProps = await LeadersTop.getInitialProps({ store });
      } else if (page === PAGES.PROPOSALS) {
        if (query.proposerId && query.proposalId) {
          passProps = await ProposalPage.getInitialProps({ store, query });
        } else {
          passProps = await LeaderProposals.getInitialProps({ store });
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('LeadersPage getInitialProps failed:', err);
    }

    return {
      page,
      query,
      passProps,
    };
  }

  render() {
    const { page, query, passProps } = this.props;

    let content = null;

    if (page === PAGES.TOP) {
      content = <LeadersTop {...passProps} />;
    } else if (page === PAGES.PROPOSALS) {
      if (query.proposerId && query.proposalId) {
        content = <ProposalPage {...passProps} />;
      } else {
        content = <LeaderProposals {...passProps} />;
      }
    }

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
        {content}
      </div>
    );
  }
}
