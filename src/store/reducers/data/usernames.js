import u from 'updeep';
import { path } from 'ramda';

import { FETCH_PROFILE_SUCCESS } from 'store/constants';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FETCH_PROFILE_SUCCESS: {
      const profiles = path(['entities', 'profiles'], payload);
      const profile = profiles[payload.result];

      return u.updateIn(profile.username, profile.userId, state);
    }

    default:
      return state;
  }
}
