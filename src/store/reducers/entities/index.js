import { combineReducers } from 'redux';

import posts from './posts';
import postComments from './postComments';
import profileComments from './profileComments';
import users from './users';
import profiles from './profiles';
import notifications from './notifications';
import activities from './activities';
import replies from './replies';
import tags from './tags';
import contentMetas from './contentMetas';

export default combineReducers({
  posts,
  postComments,
  profileComments,
  users,
  profiles,
  notifications,
  activities,
  replies,
  tags,
  contentMetas,
});
