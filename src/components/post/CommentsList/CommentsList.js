import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import InfinityScrollHelper from 'components/common/InfinityScrollHelper';
import NestedComments from 'components/post/NestedComments';

const Wrapper = styled.div`
  margin-top: 16px;
`;

export default class CommentsList extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    allowFetch: PropTypes.bool.isRequired,
    fetchComments: PropTypes.func.isRequired,
  };

  onNeedLoadMore = () => {
    const { fetchComments } = this.props;
    fetchComments();
  };

  render() {
    const { list, allowFetch } = this.props;

    return (
      <Wrapper>
        <InfinityScrollHelper disabled={!allowFetch} onNeedLoadMore={this.onNeedLoadMore}>
          {list.map(node => (
            <NestedComments key={node.commentId} commentNode={node} />
          ))}
        </InfinityScrollHelper>
      </Wrapper>
    );
  }
}
