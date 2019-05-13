import { createSelector } from 'reselect';
import { currentUserIdSelector } from './auth';

// eslint-disable-next-line
export const isOwnerSelector = userId =>
  createSelector(
    [currentUserIdSelector],
    currentUserId => currentUserId === userId
  );
