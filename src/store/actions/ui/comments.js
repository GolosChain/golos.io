import { SET_COMMENTS_FILTER } from 'store/constants/actionTypes';

// eslint-disable-next-line import/prefer-default-export
export function setCommentsFilter(filter) {
  return {
    type: SET_COMMENTS_FILTER,
    payload: { filter },
  };
}
