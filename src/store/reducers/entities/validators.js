import { path } from 'ramda';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  const entities = path(['entities', 'validators'], payload);

  if (entities) {
    state = { ...state, ...entities };
  }

  return state;
}
