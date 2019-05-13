import { combineReducers } from 'redux';

import feed from './feed';
import postComments from './postComments';
import profileComments from './profileComments';
import registration from './registration';
import notifications from './notifications';
import user from './user';
import activities from './activities';
import replies from './replies';
import tags from './tags';
import wallet from './wallet';
import post from './post';
import postVotes from './postVotes';
import commentVotes from './commentVotes';

export default combineReducers({
  feed,
  post,
  postComments,
  profileComments,
  registration,
  notifications,
  user,
  activities,
  replies,
  tags,
  wallet,
  postVotes,
  commentVotes,
});
