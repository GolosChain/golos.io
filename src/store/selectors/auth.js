import { dataSelector, entitySelector } from './common';

export const currentUserSelector = dataSelector(['auth', 'currentUser']);

export const currentUsernameSelector = dataSelector(['auth', 'currentUser', 'username']);
export const currentUserIdSelector = dataSelector(['auth', 'currentUser', 'userId']);

export const isAuthorized = state => Boolean(currentUserSelector(state));

export const currentUnsafeUserSelector = state => {
  const currentUser = currentUserSelector(state);

  if (currentUser) {
    return currentUser;
  }

  const serverCurrentUser = dataSelector('serverAuth')(state);

  if (serverCurrentUser && serverCurrentUser.userId) {
    return serverCurrentUser;
  }

  return null;
};

export const isUnsafeAuthorized = state => Boolean(currentUnsafeUserSelector(state));

export const currentUnsafeUserIdSelector = state => {
  const user = currentUnsafeUserSelector(state);

  if (!user) {
    return null;
  }

  return user.userId;
};

export const currentUnsafeServerUserIdSelector = state => {
  if (!process.browser) {
    return dataSelector(['serverAuth', 'userId'])(state);
  }

  return currentUsernameSelector(state);
};

export const loggedProfileSelector = state => {
  const userId = currentUnsafeUserIdSelector(state);

  if (!userId) {
    return null;
  }

  return entitySelector('profiles', userId)(state);
};
