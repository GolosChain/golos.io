import { connect } from 'react-redux';

import { fetchFavorites } from 'store/actions/gate';
import { isOwnerSelector } from 'store/selectors/user';
import {
  dataSelector,
  createDeepEqualSelector,
  uiSelector,
  profileSelector,
} from 'store/selectors/common';
import { authProtection } from 'helpers/hoc';

import FavoritesContent from './FavoritesContent';

export default authProtection()(
  connect(
    createDeepEqualSelector(
      [
        (state, props) => profileSelector(props.userId)(state),
        (state, props) => isOwnerSelector(props.userId)(state),
        dataSelector('favorites'),
        uiSelector(['mode', 'isSSR']),
      ],
      (profile, isOwner, favorites, isSSR) => {
        const postsList = favorites?.postsList || [];

        return {
          profile,
          isOwner,
          isSSR,
          list: postsList,
        };
      }
    ),
    {
      fetchFavorites,
    }
  )(FavoritesContent)
);
