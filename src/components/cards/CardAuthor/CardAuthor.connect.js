import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { entitySelector } from 'store/selectors/common';
// import { currentPostSelector, authorSelector } from 'app/redux/selectors/post/commonPost';
// import { followingSelector } from 'app/redux/selectors/follow/follow';
// import { updateFollow } from 'app/redux/actions/follow';

import CardAuthor from './CardAuthor';

export default connect(
  createStructuredSelector({
    profile: (state, props) => entitySelector('profiles', props.author.id)(state),
  })
)(CardAuthor);
