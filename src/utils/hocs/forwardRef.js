import React from 'react';
import { omit } from 'ramda';

/**
 * Пробрасывает ref через forwardedRef prop
 *
 * @param {string} [refName='forwardedRef']
 */
export default (refName = 'forwardedRef') => Comp => props => (
  // eslint-disable-next-line react/destructuring-assignment
  <Comp ref={props[refName]} {...omit([refName], props)} />
);
