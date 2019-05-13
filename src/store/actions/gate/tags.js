/* eslint-disable import/prefer-default-export */

import {
  FETCH_HASHTAGTOP,
  FETCH_HASHTAGTOP_SUCCESS,
  FETCH_HASHTAGTOP_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { tagsSchema } from 'store/schemas/gate';
import { HASHTAGSTOP_FETCH_LIMIT } from 'shared/constants';

export const getHashTagTop = ({ sequenceKey = null } = {}) => dispatch => {
  const newParams = {
    communityId: 'gls',
    limit: HASHTAGSTOP_FETCH_LIMIT,
    sequenceKey,
  };

  // TODO: delete when service will pass sequenceKey with null
  if (!newParams.sequenceKey) {
    delete newParams.sequenceKey;
  }

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_HASHTAGTOP, FETCH_HASHTAGTOP_SUCCESS, FETCH_HASHTAGTOP_ERROR],
      method: 'content.getHashTagTop',
      params: newParams,
      schema: {
        items: [tagsSchema],
      },
    },
    meta: newParams,
  });
};
