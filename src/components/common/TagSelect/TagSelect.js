import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Tag from 'components/golos-ui/Tag';
import Popover from 'components/common/Popover';

const SLIDER_OFFSET = 8;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  position: relative;
`;

const TagStyled = styled(Tag)`
  cursor: pointer;
`;

const TooltipWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 40px;
  width: 100%;
  min-width: 174px;
  margin: 0 -${SLIDER_OFFSET}px;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  background: #fff;
  animation: from-down 0.2s;
`;

const Action = styled.div`
  position: relative;
  flex: 1;
  padding: 0 14px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.67;
  color: #2879ff;
  cursor: pointer;

  ${is('active')`
    color: #959595;
  `};

  ${is('remove')`
    color: #fc5d16;
  `};

  &:not(:last-child) {
    &:after {
      position: absolute;
      content: '';
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #f1f1f1;
    }
  }
`;

export default class SelectTag extends Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
    onTagClick: PropTypes.func.isRequired,
    onlyRemove: PropTypes.bool,
    isSelected: PropTypes.bool,
    ariaLabel: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    onlyRemove: false,
    isSelected: false,
    className: null,
  };

  popoverRef = createRef();

  handleTagClick = () => {
    const { onTagClick, tag } = this.props;

    if (onTagClick) {
      onTagClick(tag);
    }

    if (this.popoverRef.current) {
      this.popoverRef.current.close();
    }
  };

  renderActions = () => {
    return (
      <TooltipWrapper>
        <Action onClick={this.handleTagClick} remove>
          {tt('g.delete')}
        </Action>
      </TooltipWrapper>
    );
  };

  render() {
    const { tag, isSelected, onlyRemove, ariaLabel, className } = this.props;

    if (onlyRemove) {
      return (
        <Wrapper className={className}>
          <Popover ref={this.popoverRef} content={this.renderActions} up>
            <TagStyled selected={isSelected ? 1 : 0}>{tag}</TagStyled>
          </Popover>
        </Wrapper>
      );
    }

    return (
      <Wrapper role="button" aria-label={ariaLabel} className={className}>
        <TagStyled onClick={this.handleTagClick} selected={isSelected ? 1 : 0}>
          {tag}
        </TagStyled>
      </Wrapper>
    );
  }
}
