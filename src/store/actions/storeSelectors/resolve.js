import { entitySelector } from '../../selectors/common';

export const resolveUsername = userId => (dispatch, getState) => {
  return entitySelector('users', userId)(getState())?.username;
};
