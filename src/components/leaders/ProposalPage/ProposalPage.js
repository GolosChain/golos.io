import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { fetchProposal } from 'store/actions/gate';
import { formatProposalId } from 'store/schemas/gate';

import ProposalCard from '../ProposalCard';

const Wrapper = styled.div`
  max-width: 1150px;
  padding-bottom: 24px;
  margin: 0 auto 0;
`;

const Title = styled.h1``;

export default class ProposalPage extends PureComponent {
  static async getInitialProps({ store, query }) {
    await store.dispatch(
      fetchProposal({
        proposerId: query.proposerId,
        proposalId: query.proposalId,
      })
    );

    return {
      proposerId: query.proposerId,
      proposalId: query.proposalId,
    };
  }

  render() {
    const { proposerId, proposalId } = this.props;

    return (
      <Wrapper>
        <Title>{tt('witnesses_jsx.proposal_page.title')}</Title>
        <ProposalCard fullProposalId={formatProposalId(proposerId, proposalId)} />
      </Wrapper>
    );
  }
}
