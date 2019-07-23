import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.li`
  margin: 10px 0;
`;

const StructureLine = styled.div`
  display: flex;
`;

const StructureName = styled.h2`
  font-size: 18px;
`;

const HasChanges = styled.span`
  margin-left: 8px;
`;

const ToggleButton = styled.button.attrs({ type: 'button' })`
  margin-left: 16px;
  cursor: pointer;
`;

export default class StructureWrapper extends PureComponent {
  state = {
    isCollapsed: true,
  };

  wrapperRef = createRef();

  onCollapseClick = () => {
    this.setState(
      state => ({
        isCollapsed: !state.isCollapsed,
      }),
      () => {
        if (!this.state.isCollapsed) {
          const el = this.wrapperRef.current;

          if (el.scrollIntoViewIfNeeded) {
            el.scrollIntoViewIfNeeded();
          } else if (el.scrollIntoView) {
            el.scrollIntoView();
          }
        }
      }
    );
  };

  render() {
    const { title, hasChanges, children } = this.props;
    const { isCollapsed } = this.state;

    return (
      <Wrapper ref={this.wrapperRef}>
        <StructureLine>
          <StructureName>{title}</StructureName>
          {hasChanges ? <HasChanges>(has changes)</HasChanges> : null}
          <ToggleButton onClick={this.onCollapseClick}>
            {isCollapsed ? 'Open' : 'Hide'}
          </ToggleButton>
        </StructureLine>
        {isCollapsed ? null : children}
      </Wrapper>
    );
  }
}
