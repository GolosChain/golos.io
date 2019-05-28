import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { omit } from 'ramda';
import throttle from 'lodash.throttle';

const Wrapper = styled.div``;

export default class InfinityScrollHelper extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    isDialog: PropTypes.bool,

    onNeedLoadMore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    isDialog: false,
  };

  wrapperRef = createRef();

  checkLoadMore = throttle(() => {
    const { disabled, onNeedLoadMore } = this.props;

    if (disabled) {
      return;
    }

    const wrapper = this.wrapperRef.current;
    const { bottom } = wrapper.getBoundingClientRect();

    if (window.innerHeight * 1.5 > bottom) {
      onNeedLoadMore();
    }
  }, 500);

  componentDidMount() {
    const { isDialog } = this.props;
    this.dialogWrapper = document.querySelector('.DialogManager__window-wrapper');

    if (isDialog && this.dialogWrapper) {
      this.dialogWrapper.addEventListener('scroll', this.checkLoadMore);
    } else {
      window.addEventListener('scroll', this.checkLoadMore);
    }

    window.addEventListener('resize', this.checkLoadMore);

    this.delayedCheck = setTimeout(() => {
      this.checkLoadMore();
    }, 0);
  }

  componentWillUnmount() {
    const { isDialog } = this.props;

    if (isDialog && this.dialogWrapper) {
      this.dialogWrapper.removeEventListener('scroll', this.checkLoadMore);
    } else {
      window.removeEventListener('scroll', this.checkLoadMore);
    }

    clearTimeout(this.delayedCheck);

    window.removeEventListener('resize', this.checkLoadMore);
    this.checkLoadMore.cancel();
  }

  render() {
    return <Wrapper {...omit(['onNeedLoadMore', 'disabled'], this.props)} ref={this.wrapperRef} />;
  }
}
