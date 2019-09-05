import { path, map, omit } from 'ramda';

import { UPDATE_PROFILE_DATA_SUCCESS } from 'store/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  let newState = state;

  const users = path(['entities', 'users'], payload);

  if (users) {
    newState = {
      ...newState,
      ...map(
        user => ({
          ...user,
          username: user.username ? user.username.replace(/@golos$/, '') : null,
        }),
        users
      ),
    };
  }

  const profiles = path(['entities', 'profiles'], payload);

  if (profiles) {
    newState = {
      ...newState,
      ...map(
        profile => ({
          id: profile.userId,
          username: (profile.username || profile.userId).replace(/@golos$/, ''),
          avatarUrl: profile.personal?.avatarUrl || null,
          stats: profile.stats,
        }),
        profiles
      ),
    };
  }

  switch (type) {
    case UPDATE_PROFILE_DATA_SUCCESS:
      const { account, meta: updatedMeta } = meta;

      const user = newState[account];

      if (!user) {
        return newState;
      }

      if (updatedMeta.profile_image) {
        return {
          ...newState,
          [account]: {
            ...user,
            avatarUrl: updatedMeta.profile_image,
          },
        };
      }

      return newState;

    default:
      return newState;
  }
}
