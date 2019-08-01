import styled from 'styled-components';
import Tab from 'components/golos-ui/Tab';

export const TabsList = styled.ul`
  padding: 0;
  margin: 7px -3px;
  list-style: none;
`;

const activeStyles = `
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
`;

export const TabTitleItem = styled(Tab)`
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  ${({ active }) => active && activeStyles};

  &.${({ activeClassName }) => activeClassName} {
    ${activeStyles};
  }
`;
TabTitleItem.defaultProps = {
  activeClassName: 'active',
};

/*
export const TabActiveBorder = styled.div`
  position: absolute;
  bottom: -1px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: left, width;

  &:after,
  &:before {
    bottom: 100%;
    left: 50%;
    border: solid transparent;
    content: ' ';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  &:after {
    border-color: rgba(255, 255, 255, 0);
    border-bottom-color: #fff;
    border-width: 5px;
    margin-left: -5px;
  }

  &:before {
    border-color: rgba(233, 233, 233, 0);
    border-bottom-color: #e9e9e9;
    border-width: 6px;
    margin-left: -6px;
  }
`;
*/

export const TabsContainer = styled.div`
  position: relative;
  padding: 0 14px;
  border-bottom: 1px solid #e9e9e9;
  user-select: none;
`;
