import { connect } from 'react-redux';

import { addFavorite, removeFavorite, fetchFavorites } from 'store/actions/gate';

// import { toggleFavorite } from 'app/redux/actions/favorites';

import CompactPostCardMenu from './CompactPostCardMenu';

export default connect(
  null,
  {
    addFavorite,
    removeFavorite,
    fetchFavorites,
  }
)(CompactPostCardMenu);
