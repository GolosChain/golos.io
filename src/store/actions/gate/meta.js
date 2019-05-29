/* eslint-disable import/prefer-default-export */

import {
  RECORD_POST_VIEW,
  RECORD_POST_VIEW_SUCCESS,
  RECORD_POST_VIEW_ERROR,
} from 'store/constants';
import { CALL_GATE } from 'store/middlewares/gate-api';
import { formatContentId } from 'store/schemas/gate';

export const recordPostView = contentId => {
  const contentUrl = formatContentId(contentId);

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
