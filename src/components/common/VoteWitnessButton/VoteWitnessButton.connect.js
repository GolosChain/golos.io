import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { unvoteWitness, voteWitness } from 'store/actions/cyberway';
import { showLoginOldDialog } from 'store/actions/modals';
import { statusSelector } from 'store/selectors/common';
import { currentUsernameSelector } from 'store/selectors/auth';

import VoteWitnessButton from './VoteWitnessButton';

export default connect(
  createSelector(
    [statusSelector('user'), currentUsernameSelector],
    (userStatus, currentUsername) => ({
      isLoading: userStatus.isLoadingVoteWitness,
      currentUsername,
      isVoted: false,
    })
  ),
  {
    voteWitness,
    unvoteWitness,
    showLoginOldDialog,
  }
)(VoteWitnessButton);
