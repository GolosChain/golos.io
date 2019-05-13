import { path, map } from 'ramda';
import update from 'immutability-helper';

import { SET_COMMENT_VOTE, AUTH_LOGOUT } from 'store/constants';
import { formatContentId } from 'store/schemas/gate';
import { unsetVoteStatus } from 'store/utils/reducers';
import { applyVotesChanges } from 'utils/votes';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  const entities = path(['entities', 'profileComments'], payload);

  if (entities) {
    return {
      ...state,
      ...map(
        comment => ({
          type: 'comment',
          ...comment,
          id: formatContentId(comment.contentId),
        }),
        entities
      ),
    };
  }

  switch (type) {
    case SET_COMMENT_VOTE:
      if (state[payload.id]) {
        return update(state, {
          [payload.id]: {
            votes: {
              $apply: votes => applyVotesChanges(votes, payload.status),
            },
          },
        });
      }
      return state;

    case AUTH_LOGOUT:
      return unsetVoteStatus(state);

    default:
      return state;
  }
}
