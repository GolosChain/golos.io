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
        user =>
          // Rename field 'userId' -> 'id'
          omit(['userId'], {
            ...user,
            id: user.userId,
            username: (user.username || user.userId).replace(/@golos$/, ''),
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
