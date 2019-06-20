import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import is from 'styled-is';

import { displayError } from 'utils/toastMessages';
import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';

const IconStyled = styled(Icon)`
  flex-shrink: 0;
  margin-right: 6px;
`;

const collapseStyles = `
  width: 34px;
  height: 34px;
  min-width: 0;
  border-radius: 50%;

  span {
    display: none;
  }

  svg {
    min-width: 12px;
    min-height: 12px;
    margin: 0;
  };
`;

const Wrapper = styled(Button)`
  position: relative;
  display: flex;

  ${is('collapse')`
    ${collapseStyles}
  `};

  ${is('collapseOnMobile')`
    @media (max-width: 500px) {
      ${collapseStyles}
    }
  `};
`;

const ButtonInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 165px;
  font-size: 12px;
  font-weight: bold;
  line-height: 23px;

  span {
    margin-top: 1px;
  }

  ${is('isInvisible')`
    visibility: hidden;
  `};
`;

const LoaderWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Loader = styled(Icon).attrs({ name: 'refresh2' })`
  width: 26px;
  height: 26px;
  animation: rotate 1s linear infinite;
`;

export default class Follow extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    currentUserId: PropTypes.string,
    collapseOnMobile: PropTypes.bool,
    collapse: PropTypes.bool,
    isFollow: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    currentUserId: null,
    collapseOnMobile: false,
    collapse: false,
    onClick: null,
  };

  state = {
    inProcess: false,
  };

  onClick = async e => {
    const { userId, isFollow, pin, unpin, onClick } = this.props;

    this.setState({
      inProcess: true,
    });

    try {
      if (isFollow) {
        await unpin(userId);
      } else {
        await pin(userId);
      }
    } catch (err) {
      displayError(err);
    }

    this.setState({
      inProcess: false,
    });

    if (onClick) {
      onClick(e);
    }
  };

  render() {
    const { userId, currentUserId, collapseOnMobile, collapse, isFollow, className } = this.props;
    const { inProcess } = this.state;

    if (userId === currentUserId) {
      return null;
    }

    return (
      <Wrapper
        light={isFollow}
        collapseOnMobile={collapseOnMobile}
        collapse={collapse}
        className={className}
        disabled={inProcess}
        onClick={this.onClick}
      >
        <ButtonInner isInvisible={inProcess}>
          {isFollow ? (
            <>
              <IconStyled width="14" height="10" name="tick" />
              <span>{tt('g.unfollow')}</span>
            </>
          ) : (
            <>
              <IconStyled width="14" height="14" name="plus" />
              <span>{tt('g.follow')}</span>
            </>
          )}
        </ButtonInner>
        {inProcess ? (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        ) : null}
      </Wrapper>
    );
  }
}
