import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import Head from 'next/head';

import LoadingIndicator from 'components/elements/LoadingIndicator';
import FavoritePostsList from 'components/common/CardsList/FavoritePostsList';
import InfoBlock from 'components/common/InfoBlock';
import EmptyBlock, { EmptySubText } from 'components/common/EmptyBlock';
import CardsListWrapper from 'components/common/CardsListWrapper';
import { visuallyHidden } from 'helpers/styles';

const Loader = styled(LoadingIndicator)`
  margin-top: 30px;
`;

const Header = styled.h1`
  ${visuallyHidden};
`;

export default class FavoritesContent extends Component {
  static propTypes = {
    isOwner: PropTypes.bool,
    userId: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.string),
    isSSR: PropTypes.bool,

    fetchFavorites: PropTypes.func.isRequired,
  };

  static defaultProps = {
    userId: '',
    isOwner: false,
    list: null,
    isSSR: false,
  };

  async componentDidMount() {
    const { fetchFavorites } = this.props;
    try {
      await fetchFavorites();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  renderFavoritesList() {
    const { isSSR, isOwner, list, userId } = this.props;

    if (isSSR) {
      return <Loader type="circle" center size={40} />;
    }

    if (!isOwner) {
      return <InfoBlock>{tt('favorites.info_block')}</InfoBlock>;
    }

    if (!list) {
      return <Loader type="circle" center size={40} />;
    }

    if (!list.length) {
      return (
        <InfoBlock>
          <EmptyBlock>
            {tt('favorites.empty_block')}
            <EmptySubText>{tt('favorites.empty_sub_text')}</EmptySubText>
          </EmptyBlock>
        </InfoBlock>
      );
    }

    return <FavoritePostsList isProfile userId={userId} />;
  }

  render() {
    const { profile } = this.props;

    return (
      <>
        <Head>
          <title>
            {tt('meta.title.profile.favorites', { name: profile.username || profile.userId })}
          </title>
        </Head>
        <Header>{tt('g.favorites')}</Header>
        <CardsListWrapper noGaps>{this.renderFavoritesList()}</CardsListWrapper>
      </>
    );
  }
}
