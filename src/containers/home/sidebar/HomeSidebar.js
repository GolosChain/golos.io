import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'next/router';

import TagsCard from 'components/home/sidebar/TagsCard';
import { CONTAINER_MOBILE_WIDTH } from 'constants/container';
import { getHashTagTop } from 'store/actions/gate';

const Wrapper = styled.div`
  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    margin: 0 16px;
  }
`;

// Show TagsCard only for `created`
function checkShowTagsCard(asPath) {
  return asPath === '/created';
}

@withRouter
export default class HomeSidebar extends Component {
  static propTypes = {
    router: PropTypes.shape({
      asPath: PropTypes.string.isRequired,
    }).isRequired,
    selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  static async getInitialProps({ store, query: { tags }, asPath }) {
    try {
      if (checkShowTagsCard(asPath)) {
        await store.dispatch(getHashTagTop());
      }
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
    const {
      selectedTags,
      router: { asPath },
    } = this.props;

    return (
      <Wrapper>
        {checkShowTagsCard(asPath) ? <TagsCard selectedTags={selectedTags} /> : null}
      </Wrapper>
    );
  }
}
