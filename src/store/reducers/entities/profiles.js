import { path } from 'ramda';
import update from 'immutability-helper';

import { mergeEntities } from 'utils/store';
import { UPDATE_PROFILE_DATA_SUCCESS } from 'store/constants';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = path(['entities', 'profiles'], payload);

  if (entities) {
    return mergeEntities(state, entities, {
      transform: profile => {
        const transferFromSteemToGolosDate = '2016-09-29T12:00:00Z';
        const updatedProfile = { ...profile };

        updatedProfile.username = (profile.username || profile.userId).replace(/@golos$/, '');

        if (
          !profile.created ||
          new Date(updatedProfile.created) < new Date(transferFromSteemToGolosDate)
        ) {
          updatedProfile.created = transferFromSteemToGolosDate;
        }

        if (!updatedProfile.personal) {
          updatedProfile.personal = {};
        }

        return updatedProfile;
      },
    });
  }

  switch (type) {
    case UPDATE_PROFILE_DATA_SUCCESS:
      const { account, meta: updatedMeta } = meta;

      const profile = state[account];

      if (!profile) {
        return state;
      }

      const updatePersonal = {};

      if (updatedMeta.profile_image !== undefined) {
        updatePersonal.avatarUrl = updatedMeta.profile_image;
      }

      if (updatedMeta.cover_image !== undefined) {
        updatePersonal.coverUrl = updatedMeta.cover_image;
      }

      return update(state, {
        [account]: {
          personal: {
            $merge: updatePersonal,
          },
        },
      });
    default:
      return state;
  }
}
