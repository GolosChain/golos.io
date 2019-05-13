/* eslint-disable import/prefer-default-export */

export const UIModeSelector = modeName => state => state.ui.mode[modeName];

export const UICommentSortSelector = state => state.ui.comments.filterSortBy;
