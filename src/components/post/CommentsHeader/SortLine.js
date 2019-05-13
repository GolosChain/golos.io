import React, { Component } from 'react';
import { Link } from 'mocks/react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import { SORT_BY_NEWEST, SORT_BY_OLDEST } from 'shared/constants';

const Wrapper = styled(Link)`
  display: block;
  padding: 11px 16px;
  color: #333;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active,
  &:hover,
  &:focus {
    color: #333;
  }
`;

export default class SortLine extends Component {
  static propTypes = {
    sortCategory: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  onClick = () => {
    const { sortCategory, onChange } = this.props;
    onChange(sortCategory);
  };

  urlSortParam() {
    const { sortCategory } = this.props;

    switch (sortCategory) {
      case SORT_BY_NEWEST:
        return 'new';
      case SORT_BY_OLDEST:
        return 'old';
    }
  }

  render() {
    const { sortCategory } = this.props;
    const urlWithSortParam = `${window.location.pathname}?sort=${this.urlSortParam()}#comments`;

    return (
      <Wrapper to={urlWithSortParam} onClick={this.onClick}>
        {tt(['post_jsx', sortCategory])}
      </Wrapper>
    );
  }
}
