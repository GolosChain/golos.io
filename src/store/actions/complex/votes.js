/* eslint-disable import/prefer-default-export */

import { SET_POST_VOTE, SET_COMMENT_VOTE } from 'store/constants';
import { currentUserIdSelector } from 'store/selectors/auth';
import { vote as cyberwayVote } from 'store/actions/cyberway/publish';
import { formatContentId } from 'store/schemas/gate';
import { fetchChargers } from 'store/actions/gate';

export const vote = ({ contentId, type, weight }) => async (dispatch, getState) => {
  const userId = currentUserIdSelector(getState());

  const voteResult = await dispatch(
    cyberwayVote({
      message_id: {
        author: contentId.userId,
        permlink: contentId.permlink,
      },
      weight,
    })
  );

  const actionType = type === 'post' ? SET_POST_VOTE : SET_COMMENT_VOTE;

  let status;

  if (weight > 0) {
    status = 'upvote';
  } else if (weight < 0) {
    status = 'downvote';
  } else {
    status = 'unvote';
  }

  dispatch({
    type: actionType,
    payload: {
      id: formatContentId(contentId),
      status,
    },
  });

  await dispatch(fetchChargers(userId));

  return voteResult;
};
