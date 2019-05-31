import { map } from 'ramda';
import update from 'immutability-helper';

// eslint-disable-next-line import/prefer-default-export
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
