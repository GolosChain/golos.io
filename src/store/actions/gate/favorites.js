import {
  FETCH_FAVORITES,
  FETCH_FAVORITES_SUCCESS,
  FETCH_FAVORITES_ERROR,
  ADD_FAVORITE,
  ADD_FAVORITE_SUCCESS,
  ADD_FAVORITE_ERROR,
  REMOVE_FAVORITE,
  REMOVE_FAVORITE_SUCCESS,
  REMOVE_FAVORITE_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchFavorites = () => ({
  [CALL_GATE]: {
    types: [FETCH_FAVORITES, FETCH_FAVORITES_SUCCESS, FETCH_FAVORITES_ERROR],
    method: 'favorites.get',
    params: {},
  },
  meta: {
    waitAutoLogin: true,
  },
});

export const addFavorite = permlink => ({
  [CALL_GATE]: {
    types: [ADD_FAVORITE, ADD_FAVORITE_SUCCESS, ADD_FAVORITE_ERROR],
    method: 'favorites.add',
    params: {
      permlink,
    },
  },
  meta: {
    permlink,
    waitAutoLogin: true,
  },
});

export const removeFavorite = permlink => ({
  [CALL_GATE]: {
    types: [REMOVE_FAVORITE, REMOVE_FAVORITE_SUCCESS, REMOVE_FAVORITE_ERROR],
    method: 'favorites.remove',
    params: {
      permlink,
    },
  },
  meta: {
    permlink,
    waitAutoLogin: true,
  },
});
