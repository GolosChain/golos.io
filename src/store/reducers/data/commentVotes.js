import { FETCH_COMMENT_VOTES_SUCCESS } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  switch (type) {
    case FETCH_COMMENT_VOTES_SUCCESS:
      return {
        ...state,
        [formatContentId(meta.contentId)]: payload,
      };
    default:
      return state;
  }
}
