import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { CONTAINER_MOBILE_WIDTH } from 'constants/container';
import { getHashTagTop } from 'store/actions/gate';
import TagsCard from 'components/home/sidebar/TagsCard';
// import KunaSideAdvertisement from 'components/advertisement/KunaSideAdvertisement';

const Wrapper = styled.div`
  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    margin: 0 16px;
  }
`;

export default class HomeSidebar extends Component {
  static propTypes = {
    selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  static async getInitialProps({ store, query: { tags } }) {
    try {
      await store.dispatch(getHashTagTop());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }

    const selectedTags = tags ? tags.split(',') : [];
    return {
      selectedTags,
    };
  }

  render() {
    const { selectedTags, isMobile } = this.props;

    return (
      <Wrapper>
        {/* isMobile ? null : <KunaSideAdvertisement /> */}
        <TagsCard selectedTags={selectedTags} />
      </Wrapper>
    );
  }
}
