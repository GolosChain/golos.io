import { openModal } from 'redux-modals-manager';

import {
  SHOW_MODAL_VOTERS,
  SHOW_MODAL_QR_KEY,
  SHOW_MODAL_PAYOUT_INFO,
  SHOW_MODAL_DISLIKE_ALERT,
  SHOW_MODAL_UNFOLLOW_ALERT,
  SHOW_MODAL_FOLLOWERS,
  SHOW_MODAL_DELEGATE_VOTE,
} from 'store/constants';

export function openVotersDialog(params) {
  return openModal(SHOW_MODAL_VOTERS, params);
}

export function showQrKeyDialog(params) {
  return openModal(SHOW_MODAL_QR_KEY, params);
}

export function showPayoutDialog(postLink) {
  return openModal(SHOW_MODAL_PAYOUT_INFO, { postLink });
}

export function showDislikeAlert(postLink) {
  return openModal(SHOW_MODAL_DISLIKE_ALERT, { postLink });
}

export function showUnfollowAlert(targetUserId) {
  return openModal(SHOW_MODAL_UNFOLLOW_ALERT, { targetUserId });
}

export function showFollowersDialog({ userId, type }) {
  return openModal(SHOW_MODAL_FOLLOWERS, { userId, type });
}

export function showDelegateVoteDialog(params) {
  return openModal(SHOW_MODAL_DELEGATE_VOTE, params);
}