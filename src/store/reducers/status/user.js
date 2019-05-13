import {
  FOLLOW_USER,
  FOLLOW_USER_ERROR,
  FOLLOW_USER_SUCCESS,
  BLOCK_USER,
  BLOCK_USER_SUCCESS,
  BLOCK_USER_ERROR,
  VOTE_WITNESS,
  VOTE_WITNESS_SUCCESS,
  VOTE_WITNESS_ERROR,
  UNFOLLOW_USER,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_ERROR,
  UNBLOCK_USER,
  UNBLOCK_USER_SUCCESS,
  UNBLOCK_USER_ERROR,
  UNVOTE_WITNESS,
  UNVOTE_WITNESS_SUCCESS,
  UNVOTE_WITNESS_ERROR,
} from 'store/constants/actionTypes';

const initialState = {
  isLoadingFollow: false,
  isLoadingBlock: false,
  isLoadingVoteWitness: false,
};

export default function(state = initialState, { type }) {
  switch (type) {
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      return {
        ...state,
        isLoadingFollow: true,
      };

    case FOLLOW_USER_SUCCESS:
    case UNFOLLOW_USER_SUCCESS:
      return {
        ...state,
        isLoadingFollow: false,
      };

    case FOLLOW_USER_ERROR:
    case UNFOLLOW_USER_ERROR:
      return {
        ...state,
        isLoadingFollow: false,
      };

    case BLOCK_USER:
    case UNBLOCK_USER:
      return {
        ...state,
        isLoadingBlock: true,
      };

    case BLOCK_USER_SUCCESS:
    case UNBLOCK_USER_SUCCESS:
      return {
        ...state,
        isLoadingBlock: false,
      };

    case BLOCK_USER_ERROR:
    case UNBLOCK_USER_ERROR:
      return {
        ...state,
        isLoadingBlock: false,
      };

    case VOTE_WITNESS:
    case UNVOTE_WITNESS:
      return {
        ...state,
        isLoadingBlock: true,
      };

    case VOTE_WITNESS_SUCCESS:
    case UNVOTE_WITNESS_SUCCESS:
      return {
        ...state,
        isLoadingBlock: false,
      };

    case VOTE_WITNESS_ERROR:
    case UNVOTE_WITNESS_ERROR:
      return {
        ...state,
        isLoadingBlock: false,
      };

    default:
      return state;
  }
}
