import { path } from 'ramda';
import update from 'immutability-helper';

import {
  SET_POST_VOTE,
  RECORD_POST_VIEW_SUCCESS,
  FETCH_POST_VIEW_COUNT_SUCCESS,
  AUTH_LOGOUT,
} from 'store/constants';
import { formatContentId } from 'store/schemas/gate';
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
    return mergeEntities(state, entities, {
      transform: post => ({
        type: 'post',
        ...post,
        id: formatContentId(post.contentId),
        meta: {
          ...post.meta,
          viewCount: undefined,
        },
      }),
      merge: (cachedPost, newPost) =>
        update(newPost, {
          content: {
            body: {
              $set: newPost.content.body,
            },
          },
          meta: {
            $set: newPost.meta,
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
            meta: {
              viewCount: {
                $apply: viewCount => viewCount + 1,
              },
            },
          },
        });
      }
      return state;
    case FETCH_POST_VIEW_COUNT_SUCCESS:
      let newState = state;

      for (const { postLink, viewCount } of payload.results) {
        if (!newState[postLink]) {
          continue;
        }

        newState = update(newState, {
          [postLink]: {
            meta: {
              viewCount: {
                $set: viewCount,
              },
            },
          },
        });
      }

      return newState;

    case AUTH_LOGOUT:
      return unsetVoteStatus(state);

    default:
      return state;
  }
}
