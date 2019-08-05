/* eslint-disable no-plusplus, no-console, consistent-return */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import Head from 'next/head';

import Card from 'components/golos-ui/Card';
import WalletShow from 'components/userProfile/WalletShow';
import PowerDownLine from 'components/wallet/PowerDownLine';

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
    const { userId } = this.props;

    return (
      <Card>
        <Head>
          <title>
            {tt('meta.title.profile.wallet', {
              name: userId,
            })}
          </title>
        </Head>
        {<PowerDownLine userId={userId} />}
        {this.renderContent()}
      </Card>
    );
  }
}
