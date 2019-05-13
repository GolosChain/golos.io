import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isOr } from 'styled-is';
import { Link } from 'shared/routes';

const Tag = styled.div`
  position: relative;
  line-height: 12px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-overflow: ellipsis;
  text-align: center;
  white-space: nowrap;
  color: #757575;
  border: solid 1px #e1e1e1;
  background-color: #fff;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: #2879ff;
  }

  ${isOr('selected', 'category')`
    color: #2879ff;
    border-color: #cde0ff;

    &:hover {
      color: #2879ff;
      border-color: #2879ff;
    }
  `};
`;

Tag.propTypes = {
  category: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

Tag.defaultProps = {
  category: 0,
};

export const TagLink = ({ passHref, params, route, children, category, ...props }) => (
  <Link route={route} params={params} passHref={passHref}>
    <Tag as="a" {...props}>
      {children}
    </Tag>
  </Link>
);
export default Tag;

TagLink.propTypes = {
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]).isRequired,
  params: PropTypes.shape({}),
  passHref: PropTypes.bool,
};

TagLink.defaultProps = {
  params: null,
  passHref: false,
};
