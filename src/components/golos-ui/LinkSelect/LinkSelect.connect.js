import { connect } from 'react-redux';

import { entitySelector } from 'store/selectors/common';

import LinkSelect from './LinkSelect';

export default connect((state, props) => {
  const usernames = {};

  for (const { params } of props.links) {
    if (params && params.userId) {
      usernames[params.userId] = entitySelector('users', params.userId)(state)?.username;
    }
  }

  return {
    usernames,
  };
})(LinkSelect);
