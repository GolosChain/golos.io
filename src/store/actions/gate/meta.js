import {
  RECORD_POST_VIEW,
  RECORD_POST_VIEW_SUCCESS,
  RECORD_POST_VIEW_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { formatContentId } from 'store/schemas/gate';

// eslint-disable-next-line import/prefer-default-export
export const recordPostView = contentId => {
  const contentUrl = formatContentId(contentId);

  if (window.ga) {
    window.ga('set', 'page', window.location.pathname);
    window.ga('send', 'pageview');
  }
  if (window.fbq) {
    window.fbq('track', 'ViewContent');
  }

  return {
    [CALL_GATE]: {
      types: [RECORD_POST_VIEW, RECORD_POST_VIEW_SUCCESS, RECORD_POST_VIEW_ERROR],
      method: 'meta.recordPostView',
      params: {
        postLink: contentUrl,
      },
    },
    meta: {
      contentUrl,
    },
  };
};
