import { CYBERWAY_API } from 'store/middlewares/cyberway-api';

import {
  UPDATE_PROFILE_DATA,
  UPDATE_PROFILE_DATA_SUCCESS,
  UPDATE_PROFILE_DATA_ERROR,
  FOLLOW_USER,
  UNFOLLOW_USER,
  BLOCK_USER,
  UNBLOCK_USER,
} from 'store/constants/actionTypes';
import { currentUserIdSelector } from 'store/selectors/auth';
import { entitySelector } from 'store/selectors/common';
import { defaults } from 'utils/common';

const CONTRACT_NAME = 'social';

const DEFAULT_META_VALUES = {
  type: null,
  about: null,
  app: null,
  email: null,
  phone: null,
  facebook: null,
  instagram: null,
  telegram: null,
  vk: null,
  website: null,
  first_name: null,
  last_name: null,
  name: null,
  birth_date: null,
  gender: null,
  location: null,
  city: null,
  occupation: null,
  i_can: null,
  looking_for: null,
  business_category: null,
  background_image: null,
  cover_image: null,
  profile_image: null,
  user_image: null,
  ico_address: null,
  target_date: null,
  target_plan: null,
  target_point_a: null,
  target_point_b: null,
};

export const updateProfileMeta = meta => async (dispatch, getState) => {
  const state = getState();
  const userId = currentUserIdSelector(state);

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const profile = entitySelector('profiles', userId)(state);

  // Warning about wrong fields (for development time only)
  if (process.env.NODE_ENV === 'development') {
    for (const fieldName of Object.keys(meta)) {
      if (DEFAULT_META_VALUES[fieldName] === undefined) {
        // eslint-disable-next-line no-console
        console.warn(
          `Field '${fieldName}' (value: ${meta[fieldName]}) not found in contract schema`
        );
      }
    }
  }

  const current = profile.personal;

  const fullMeta = defaults(
    meta,
    defaults(
      {
        name: current.name,
        about: current.about,
        profile_image: current.avatarUrl,
        cover_image: current.coverUrl,
        gender: current.gender,
        location: current.location,
        website: current.website,
      },
      DEFAULT_META_VALUES
    )
  );

  const data = {
    account: userId,
    meta: fullMeta,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [UPDATE_PROFILE_DATA, UPDATE_PROFILE_DATA_SUCCESS, UPDATE_PROFILE_DATA_ERROR],
      contract: 'social',
      method: 'updatemeta',
      params: data,
    },
    meta: data,
  });
};

export const pinAction = (methodName, actionName) => communityId => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    pinner: userId,
    pinning: communityId,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      contract: CONTRACT_NAME,
      method: methodName,
      params: data,
    },
    meta: data,
  });
};

export const pin = pinAction('pin', FOLLOW_USER);
export const unpin = pinAction('unpin', UNFOLLOW_USER);

const createBlockAction = (methodName, actionName) => userId => async (dispatch, getState) => {
  const currentUserId = currentUserIdSelector(getState());

  if (!currentUserId) {
    throw new Error('Unauthorized');
  }
  const data = {
    blocker: currentUserId,
    blocking: userId,
  };

  return dispatch({
    [CYBERWAY_API]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      contract: CONTRACT_NAME,
      method: methodName,
      params: data,
    },
    meta: data,
  });
};

export const blockUser = createBlockAction('block', BLOCK_USER);
export const unblockUser = createBlockAction('unblock', UNBLOCK_USER);
