import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';

import PostForm from 'components/modules/PostForm/loader';
import LoadingIndicator from 'components/elements/LoadingIndicator';

const GlobalStyles = createGlobalStyle`
  body {
    overflow-x: hidden;
  }
`;

const Loader = styled(LoadingIndicator).attrs({
  type: 'circle',
  center: true,
  size: 60,
})`
  height: 100%;
`;

export default class Submit extends React.PureComponent {
  static propTypes = {
    isSSR: PropTypes.bool,
  };

  static defaultProps = {
    isSSR: false,
  };

  onSuccess = () => {
    // browserHistory.push('/created');
  };

  render() {
    const { isSSR } = this.props;

    return (
      <>
        <GlobalStyles />
        {isSSR ? <Loader /> : <PostForm onSuccess={this.onSuccess} />}
      </>
    );
  }
}
