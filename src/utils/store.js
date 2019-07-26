/* eslint-disable import/prefer-default-export,no-continue */
import { mapObjIndexed } from 'ramda';

export function mergeEntities(baseEntities, newEntities, { injectId, transform, merge } = {}) {
  let newItems = newEntities;

  if (injectId) {
    newItems = mapObjIndexed((obj, id) => {
      const cloned = { ...obj };

      delete cloned.id;
      delete cloned._id;

      return {
        id,
        ...cloned,
      };
    }, newItems);
  }

  if (transform) {
    newItems = mapObjIndexed(transform, newItems);
  }

  if (merge) {
    newItems = mapObjIndexed((newItem, id) => {
      const cachedItem = baseEntities[id];

      if (cachedItem) {
        return merge(cachedItem, newItem);
      }

      return newItem;
    }, newItems);
  }

  return { ...baseEntities, ...newItems };
}
