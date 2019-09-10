export const UIModeSelector = modeName => state => state.ui.mode[modeName];
export const UICommentSortSelector = state => state.ui.comments.filterSortBy;
export const isSSRSelector = state => state.ui.mode.isSSR;
