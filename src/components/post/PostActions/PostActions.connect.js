import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { addFavorite, removeFavorite, fetchFavorites } from 'store/actions/gate';
import { currentUserIdSelector } from 'store/selectors/auth';

import PostActions from './PostActions';

export default connect(
  createStructuredSelector({
    currentUserId: currentUserIdSelector,
  }),
  {
    addFavorite,
    removeFavorite,
    fetchFavorites,
    togglePin: () => () => console.error('Unhandled action'),
  }
)(PostActions);
