import { path } from 'ramda';
import u from 'updeep';

export default function combinePathReducers(reducers) {
  const innerReducersList = Array.from(Object.keys(reducers));

  return (state, pathName, action) => {
    const entity = { ...(path(pathName, state) || {}) };
    let entityUpdated = false;

    for (const reducerField of innerReducersList) {
      const userField = entity[reducerField];
      entity[reducerField] = reducers[reducerField](userField, action);

      if (entity[reducerField] !== userField) {
        entityUpdated = true;
      }
    }

    if (!entityUpdated) {
      return state;
    }

    return u.updateIn(pathName, u.constant(entity), state);
  };
}
