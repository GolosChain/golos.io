import { FETCH_POST_VOTES, FETCH_COMMENT_VOTES } from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchEntityVotes = (methodName, actionName) => (
  contentId,
  type = 'like',
  sequenceKey = null,
  limit = 20
) => {
  const params = {
    ...contentId,
    type,
    sequenceKey,
    limit,
    app: 'gls',
  };
  return {
    [CALL_GATE]: {
      types: [actionName, `${actionName}_SUCCESS`, `${actionName}_ERROR`],
      method: methodName,
      params,
    },
    meta: {
      contentId,
      type,
      sequenceKey,
      limit,
      app: 'gls',
    },
  };
};

export const fetchPostVotes = fetchEntityVotes('content.getPostVotes', FETCH_POST_VOTES);
export const fetchCommentVotes = fetchEntityVotes('content.getCommentVotes', FETCH_COMMENT_VOTES);

export const getVoters = ({ contentId, entityType, type }, sequenceKey) => async dispatch => {
  switch (entityType) {
    case 'post':
      return dispatch(fetchPostVotes(contentId, type, sequenceKey));

    case 'comment':
      return dispatch(fetchCommentVotes(contentId, type, sequenceKey));

    default:
      return null;
  }
};
