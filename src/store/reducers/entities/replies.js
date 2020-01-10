import { path } from 'ramda';
import update from 'immutability-helper';

import { SET_COMMENT_VOTE, AUTH_LOGOUT } from 'store/constants';
import { unsetVoteStatus } from 'store/utils/reducers';
import { mergeEntities } from 'utils/store';
import { applyVotesChanges } from 'utils/votes';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  const entities = path(['entities', 'replies'], payload);

  if (entities) {
    state = mergeEntities(state, entities, {
      injectId: true,
      transform: comment => ({
        ...comment,
        type: 'comment',
      }),
    });
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
