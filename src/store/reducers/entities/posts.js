import { path } from 'ramda';
import update from 'immutability-helper';

import { SET_POST_VOTE, RECORD_POST_VIEW_SUCCESS, AUTH_LOGOUT } from 'store/constants';
import { mergeEntities } from 'utils/store';
import { applyVotesChanges } from 'utils/votes';
import { unsetVoteStatus } from 'store/utils/reducers';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = path(['entities', 'posts'], payload);

  if (entities) {
    /* Merge используется из-за того что посты в ленте и отдельным постом приходят с разными структурами данных в поле content:
     * {
     *   "body": {
     *     "preview": "<SHORT PREVIEW>"
     *   },
     *   "title": "..."
     * }
     * а при запросе поста структура иная:
     * {
     *   "body": {
     *     "full": "<FULL HTML>"
     *   },
     *   "title": "..."
     * }
     * и нужно сохранить оба поля в сторе.
     */
    state = mergeEntities(state, entities, {
      injectId: true,
      transform: post => ({
        ...post,
        type: 'post',
      }),
      merge: (cachedPost, newPost) =>
        update(newPost, {
          content: {
            body: {
              $apply: body => ({
                ...cachedPost.content.body,
                ...body,
              }),
            },
          },
        }),
    });
  }

  switch (type) {
    case SET_POST_VOTE:
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

    case RECORD_POST_VIEW_SUCCESS:
      if (state[meta.contentUrl]) {
        return update(state, {
          [meta.contentUrl]: {
            stats: {
              viewCount: {
                $apply: viewCount => viewCount + 1,
              },
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
