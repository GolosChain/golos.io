import React from 'react';
import PropTypes from 'prop-types';
import isPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

const files = require.context('!svg-sprite-loader!./assets', false, /.*\.svg$/);
files.keys().forEach(files);

const Icon = ({ name, size, height, width, ...props }) => {
  const filteredProps = {};

  Object.keys(props).forEach(prop => {
    if (isPropValid(prop)) {
      filteredProps[prop] = props[prop];
    }
  });

  return (
    <svg {...filteredProps} height={size || height} width={size || width}>
      <use xlinkHref={`#${name}`} />
    </svg>
  );
};

Icon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Icon.defaultProps = {
  height: '24',
  width: '24',
};

export default styled(Icon)``;
