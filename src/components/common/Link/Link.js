import React from 'react';
import PropTypes from 'prop-types';

import SmartLink from '../SmartLink';

export default function Link({ route, params, children, ...props }) {
  return (
    <SmartLink route={route} params={params}>
      <a {...props}>{children}</a>
    </SmartLink>
  );
}

Link.propTypes = {
  route: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
};

Link.defaultProps = {
  params: null,
};
