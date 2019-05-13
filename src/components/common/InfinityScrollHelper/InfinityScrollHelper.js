import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { omit } from 'ramda';

const Wrapper = styled.div``;

export default class InfinityScrollHelper extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onNeedLoadMore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  wrapperRef = createRef();

  componentDidMount() {
    window.addEventListener('scroll', this.checkLoadMore);
    window.addEventListener('resize', this.checkLoadMore);

    this.checkLoadMore();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkLoadMore);
    window.removeEventListener('resize', this.checkLoadMore);
  }

  checkLoadMore = () => {
    const { disabled, onNeedLoadMore } = this.props;

    if (disabled) {
      return;
    }

    const wrapper = this.wrapperRef.current;

    const { bottom } = wrapper.getBoundingClientRect();

    if (window.innerHeight * 1.5 > bottom) {
      onNeedLoadMore();
    }
  };

  render() {
    return <Wrapper {...omit(['onNeedLoadMore', 'disabled'], this.props)} ref={this.wrapperRef} />;
  }
}
