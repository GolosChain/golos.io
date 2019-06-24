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
import rates from './rates';
import proposals from './proposals';
import postVotes from './postVotes';
import commentVotes from './commentVotes';
import followers from './followers';
import following from './following';
import contractParams from './contractParams';

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
  rates,
  proposals,
  postVotes,
  commentVotes,
  followers,
  following,
  contractParams,
});
