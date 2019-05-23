import { combineReducers } from 'redux';

import auth from './auth';
import chain from './chain';
import serverAuth from './serverAuth';
import settings from './settings';
import registration from './registration';
import notifications from './notifications';
import favorites from './favorites';
import wallet from './wallet';
import witness from './witness';
import postVotes from './postVotes';
import commentVotes from './commentVotes';
import followers from './followers';
import following from './following';

export default combineReducers({
  auth,
  chain,
  registration,
  serverAuth,
  settings,
  notifications,
  favorites,
  wallet,
  witness,
  postVotes,
  commentVotes,
  followers,
  following,
});
