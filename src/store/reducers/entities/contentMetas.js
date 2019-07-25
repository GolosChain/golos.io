import { path } from 'ramda';

const initialState = {};

export default function(state = initialState, { type, payload }) {
  const entities = path(['entities', 'contentMetas'], payload);

  if (entities) {
    return { ...state, ...entities };
  }

  switch (type) {
    default:
      return state;
  }
}
