import { FETCH_PROFILE, FETCH_PROFILE_SUCCESS, FETCH_PROFILE_ERROR } from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { userProfileSchema } from 'store/schemas/gate';

// eslint-disable-next-line import/prefer-default-export
export const fetchProfile = userId => dispatch => {
  const params = {
    userId,
    type: 'gls',
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
