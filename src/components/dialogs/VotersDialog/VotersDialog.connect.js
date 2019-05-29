import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { dataSelector, statusSelector } from 'store/selectors/common';
import { getVoters } from 'store/actions/gate';
import { currentUserIdSelector } from 'store/selectors/auth';

import VotersDialog from 'components/dialogs/VotersDialog/VotersDialog';

const MAX_VOTE_PERCENT = 10000;

const getEntityByType = type => (type === 'post' ? 'postVotes' : 'commentVotes');

export default connect(
  createSelector(
    [
      (state, props) =>
        dataSelector([getEntityByType(props.data.entityType), props.id, props.data.type])(state),
      (state, props) => statusSelector(getEntityByType(props.data.entityType))(state),
      currentUserIdSelector,
    ],
    (votes, { isLoading, isEnd, sequenceKey }, currentUserId) => {
      let users = [];

      if (votes?.length) {
        users = votes.map(vote => ({
          percent: Math.abs((vote.weight / MAX_VOTE_PERCENT) * 100),
          name: vote.username,
          avatar: vote.avatarUrl,
          userId: vote.userId,
          hasSubscription: vote?.hasSubscription || false,
        }));
      }

      return {
        users,
        isLoading,
        isEnd,
        sequenceKey,
        currentUserId,
      };
    }
  ),
  {
    getVoters,
  }
)(VotersDialog);
