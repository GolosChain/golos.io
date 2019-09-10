import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TagsCard from 'components/home/sidebar/TagsCard';
import { CONTAINER_MOBILE_WIDTH } from 'constants/container';
import { getHashTagTop } from 'store/actions/gate';

const Wrapper = styled.div`
  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    margin: 0 16px;
  }
`;

export default class HomeSidebar extends Component {
  static propTypes = {
    selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    const { selectedTags } = this.props;

    return (
      <Wrapper>
        <TagsCard selectedTags={selectedTags} />
      </Wrapper>
    );
  }
}
