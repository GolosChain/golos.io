import { path } from 'ramda';
import u from 'updeep';

import { APPROVE_PROPOSAL_SUCCESS, EXEC_PROPOSAL_SUCCESS } from 'store/constants';
import { mergeEntities } from 'utils/store';
import { formatProposalId } from 'store/schemas/gate';

const initialState = {};

export default function(state = initialState, { type, payload, meta }) {
  const entities = path(['entities', 'proposals'], payload);

  if (entities) {
    state = mergeEntities(state, entities, {
      injectId: true,
    });
  }

  switch (type) {
    case APPROVE_PROPOSAL_SUCCESS:
      const id = formatProposalId(meta.proposer, meta.proposalId);

      return u.updateIn(
        [id, 'approves'],
        u.map(approve => {
          if (approve.userId === meta.userId) {
            return { ...approve, isSigned: true };
          }

          return approve;
        }),
        state
      );

    case EXEC_PROPOSAL_SUCCESS: {
      const id = formatProposalId(meta.proposer, meta.proposalId);

      return u.updateIn([id, 'isExecuted'], true, state);
    }

    default:
      return state;
  }
}
