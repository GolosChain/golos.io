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

// eslint-disable-next-line import/prefer-default-export
export const fetchProfile = ({ userId, username }) => dispatch => {
  const params = {
    app: 'gls',
  };

  if (userId) {
    params.userId = userId;
  } else if (username) {
    params.username = username;
  }

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
