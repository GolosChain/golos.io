import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { getScrollbarWidth } from 'utils/ui';

const Wrapper = styled.div``;

export default class ScrollFix extends PureComponent {
  state = {
    width: null,
  };

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.setState({
      width: window.innerWidth - getScrollbarWidth(),
    });
  };

  render() {
    const { width } = this.state;

    return (
      <Wrapper
        style={
          width
            ? {
                width,
              }
            : null
        }
        {...this.props}
      />
    );
  }
}
