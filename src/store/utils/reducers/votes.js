import { map } from 'ramda';
import update from 'immutability-helper';

export function unsetVoteStatus(state) {
  return map(
    entity =>
      update(entity, {
        votes: {
          hasUpVote: {
            $set: false,
          },
          hasDownVote: {
            $set: false,
          },
        },
      }),
    state
  );
}
