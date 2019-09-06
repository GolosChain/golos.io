import {
  FETCH_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_ERROR,
  FETCH_CHARGERS,
  FETCH_CHARGERS_SUCCESS,
  FETCH_CHARGERS_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { userProfileSchema } from 'store/schemas/gate';
import { entitySelector } from 'store/selectors/common';

// eslint-disable-next-line import/prefer-default-export
export const fetchProfile = ({ userId, username }) => dispatch => {
  const params = {
    userId,
    username,
    app: 'gls',
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_PROFILE, FETCH_PROFILE_SUCCESS, FETCH_PROFILE_ERROR],
      method: 'content.getProfile',
      params,
      schema: userProfileSchema,
    },
    meta: params,
  });
};

export const fetchProfileIfNeeded = userId => (dispatch, getState) => {
  if (!entitySelector('profiles', userId)(getState())) {
    return dispatch(fetchProfile({ userId }));
  }
  return null;
};

export const suggestNames = text => ({
  [CALL_GATE]: {
    method: 'content.suggestNames',
    params: {
      text,
      app: 'gls',
    },
  },
});

export const fetchChargers = userId => {
  const params = {
    userId,
  };

  return {
    [CALL_GATE]: {
      method: 'content.getChargers',
      types: [FETCH_CHARGERS, FETCH_CHARGERS_SUCCESS, FETCH_CHARGERS_ERROR],
      params,
    },
    meta: params,
  };
};
