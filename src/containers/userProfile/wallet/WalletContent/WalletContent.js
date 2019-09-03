import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import Head from 'next/head';
import styled from 'styled-components';
import { ToggleFeature } from '@flopflip/react-redux';

import { visuallyHidden } from 'helpers/styles';
import Card from 'components/golos-ui/Card';
import WalletShow from 'components/userProfile/WalletShow';
import PowerDownLine from 'components/wallet/PowerDownLine';
import ClaimLine from 'components/wallet/ClaimLine';

import { CLAIM_TOKENS } from 'shared/feature-flags';

const Header = styled.h1`
  ${visuallyHidden};
`;

export default class WalletContent extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  // state = {
  //   isLoading: true,
  //   error: null,
  // };

  renderContent() {
    const { userId, sections } = this.props;
    // const { isLoading, error } = this.state;
    //
    // if (error) {
    //   return <ErrorBlock>Error: {error}</ErrorBlock>;
    // }

    return (
      <WalletShow
        userId={userId}
        sections={sections}
        // isFetching={isLoading}
      />
    );
  }

  render() {
    const { userId, profile } = this.props;

    return (
      <Card>
        <Head>
          <title>{tt('meta.title.profile.wallet', { name: profile.username })}</title>
        </Head>
        <Header>{tt('g.wallet')}</Header>
        <PowerDownLine userId={userId} />
        <ToggleFeature flag={CLAIM_TOKENS}>
          <ClaimLine userId={userId} />
        </ToggleFeature>
        {this.renderContent()}
      </Card>
    );
  }
}
