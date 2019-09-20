import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import Head from 'next/head';
import styled from 'styled-components';

import { visuallyHidden } from 'helpers/styles';
import Card from 'components/golos-ui/Card';
import WalletShow from 'components/userProfile/WalletShow';
import PowerDownLine from 'components/wallet/PowerDownLine';
import ClaimLine from 'components/wallet/ClaimLine';
import VestingDelegationProposals from 'components/wallet/VestingDelegationProposals';

const Header = styled.h1`
  ${visuallyHidden};
`;

export default class WalletContent extends Component {
  static propTypes = {
    currentUserId: PropTypes.string,
    userId: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const { currentUserId, userId, profile, sections } = this.props;

    return (
      <>
        <Head>
          <title>
            {tt('meta.title.profile.wallet', { name: profile.username || profile.userId })}
          </title>
        </Head>
        <Header>{tt('g.wallet')}</Header>
        {currentUserId && currentUserId === userId ? <VestingDelegationProposals /> : null}
        <Card>
          <PowerDownLine userId={userId} />
          <ClaimLine userId={userId} />
          <WalletShow userId={userId} sections={sections} />
        </Card>
      </>
    );
  }
}
