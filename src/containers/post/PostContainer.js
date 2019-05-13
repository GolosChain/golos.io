import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Post from './Post';

const ErrorBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 40px 20px;
`;

export default class PostContainer extends PureComponent {
  static propTypes = {
    error: PropTypes.object,
  };

  static defaultProps = {
    error: null,
  };

  render() {
    const { error, ...props } = this.props;

    if (error) {
      let errorMessage;

      switch (error.code) {
        case 404:
          errorMessage = tt('post.not_found');
          break;
        default:
          errorMessage = `${tt('post.loading_error')}: ${error.message}`;
      }

      return <ErrorBlock>{errorMessage}</ErrorBlock>;
    }

    return <Post {...props} />;
  }
}
