/* eslint-disable import/prefer-default-export */
export function applyVotesChanges(votes, action) {
  const newVotes = {
    ...votes,
  };

  switch (action) {
    case 'upvote':
      return {
        upCount: votes.upCount + 1,
        downCount: votes.downCount - (votes.hasDownVote ? 1 : 0),
        hasUpVote: true,
        hasDownVote: false,
      };
    case 'downvote':
      return {
        upCount: votes.upCount - (votes.hasUpVote ? 1 : 0),
        downCount: votes.downCount + 1,
        hasUpVote: false,
        hasDownVote: true,
      };
    case 'unvote':
      return {
        upCount: votes.upCount - (votes.hasUpVote ? 1 : 0),
        downCount: votes.downCount - (votes.hasDownVote ? 1 : 0),
        hasUpVote: false,
        hasDownVote: false,
      };
    default:
  }

  if (newVotes.upCount < 0) {
    newVotes.upCount = 0;
  }

  if (newVotes.downCount < 0) {
    newVotes.downCount = 0;
  }

  return newVotes;
}
