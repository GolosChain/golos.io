import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { isNil } from 'ramda';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

// const INVALIDATION_INTERVAL = 60 * 1000;

const EyeIcon = styled(Icon).attrs({ name: 'eye' })`
  width: 20px;
  color: #333;
`;

const Text = styled.div`
  margin: 0 -1px 0 10px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 3px 0;
  font-size: 18px;
  letter-spacing: 1.6px;
  color: #757575;
  user-select: none;
  cursor: default;

  ${is('mini')`
    font-size: 16px;
    letter-spacing: 1.4px;

    ${EyeIcon} {
      width: 22px;
    }
  `};

  ${is('micro')`
    font-size: 12px;
    letter-spacing: normal;

    ${EyeIcon} {
      width: 19px;
      color: #959595;
    }

    ${Text} {
      margin-left: 6px;
    }
  `};
`;

export default class ViewCount extends Component {
  static propTypes = {
    contentUrl: PropTypes.string.isRequired,
    viewCount: PropTypes.number,
    mini: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
    micro: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),

    fetchPostViewCount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    viewCount: 0,
    mini: false,
    micro: false,
  };

  componentDidMount() {
    const { contentUrl, viewCount, fetchPostViewCount } = this.props;

    if (isNil(viewCount)) {
      fetchPostViewCount(contentUrl);
    }
  }

  render() {
    const { viewCount, mini, micro, className } = this.props;

    if (isNil(viewCount)) {
      return null;
    }

    const hint = tt('view_count.view_count');

    return (
      <Wrapper
        data-tooltip={hint}
        aria-label={hint}
        mini={mini}
        micro={micro}
        className={className}
      >
        <EyeIcon />
        <Text>{viewCount}</Text>
      </Wrapper>
    );
  }
}
