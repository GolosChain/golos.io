import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 5px;
  cursor: pointer;
`;

const ActionIcon = styled(Icon)`
  flex-shrink: 0;
`;

export default class Repost extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  repost = () => {
    // const { contentLink, openRepostDialog } = this.props;
    // openRepostDialog(contentLink);
  };

  render() {
    const { isOwner, className } = this.props;

    if (isOwner) {
      return null;
    }

    return (
      <Wrapper
        role="button"
        data-tooltip={tt('g.repost')}
        aria-label={tt('g.repost')}
        className={className}
        onClick={this.repost}
      >
        <ActionIcon width="20" height="20" name="repost" />
      </Wrapper>
    );
  }
}
