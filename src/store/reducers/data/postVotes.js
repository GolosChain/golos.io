import update from 'immutability-helper';

import { FETCH_POST_VOTES_SUCCESS } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_POST_VOTES_SUCCESS:
      if (
        state[formatContentId(meta.contentId)] &&
        meta.sequenceKey &&
        payload.sequenceKey !== meta.sequenceKey
      ) {
        return update(state, {
          [formatContentId(meta.contentId)]: {
            [meta.type]: {
              $push: payload.items,
            },
          },
        });
      }
      return {
        ...state,
        [formatContentId(meta.contentId)]: {
          ...state[formatContentId(meta.contentId)],
          [meta.type]: payload.items,
        },
      };

    default:
      return state;
  }
}
