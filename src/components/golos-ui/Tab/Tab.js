import React, { forwardRef } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import PropTypes from 'prop-types';
import { activeLink } from 'utils/hocs';

const activeStyles = `
    color: #333;
    cursor: default;
`;

const Tab = styled(
  forwardRef((
    // Перечисляем аттрибуты которые не надо пробрасывать дальше.
    {
      isLink,
      activeClassName,
      includeSubRoutes,
      includeRoute,
      forcePointerCursor,
      shallow,
      scroll,
      router,
      Comp,
      ...props
    },
    ref
  ) =>
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    isLink ? <a ref={ref} {...props} /> : <div ref={ref} {...props} />
  )
)`
  position: relative;
  display: inline-flex;
  align-items: center;

  height: 36px;
  padding: 0 6px;
  margin: 0 3px;

  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1.09px;
  text-transform: uppercase;
  color: #b7b7b9;

  cursor: pointer;

  &:hover,
  &:focus {
    color: #333;
  }

  ${({ active }) => active && activeStyles};

  &.${({ activeClassName }) => activeClassName} {
    ${activeStyles};
  }

  ${is('forcePointerCursor')`
    cursor: pointer;
  `};
`;

Tab.propTypes = {
  active: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  activeClassName: PropTypes.string,
};

Tab.defaultProps = {
  active: undefined,
  activeClassName: 'active',
};

export const TabLink = activeLink(Tab);
export default Tab;
