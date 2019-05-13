import React from 'react';
import PropTypes from 'prop-types';
import { Link as Route } from 'shared/routes';

export default function Link({ route, params, children, ...props }) {
  return (
    <Route route={route} params={params}>
      <a {...props}>{children}</a>
    </Route>
  );
}

Link.propTypes = {
  route: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
};

Link.defaultProps = {
  params: null,
};
