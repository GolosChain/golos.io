import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import SmartLink from './SmartLink';

export default connect((state, { route, params, comment }) => {
  let updateParams = params;
  let commentUsername;

  if (params && params.userId && !params.username) {
    updateParams = {
      ...params,
      username: entitySelector('users', params.userId)(state)?.username,
    };
  }

  if (route === 'post' && comment) {
    commentUsername = entitySelector('users', comment.userId)(state)?.username;
  }

  return {
    params: updateParams,
    commentUsername,
  };
})(SmartLink);
