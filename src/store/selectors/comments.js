import { createSelector } from 'reselect';

import { SORT_BY_NEWEST } from 'shared/constants';
import { formatContentId } from 'store/schemas/gate';
import { statusSelector, entitiesSelector } from './common';

const MAX_COMMENTS_DEPTH = 6;

// eslint-disable-next-line import/prefer-default-export
export const getCommentsHierarchy = (sortType, postContentId) =>
  createSelector(
    [
      statusSelector(['postComments', formatContentId(postContentId), 'order']),
      entitiesSelector('postComments'),
    ],
    (order = [], comments) => {
      const root = {
        commentId: null,
        parentId: null,
        children: [],
        level: 0,
      };

      const nodes = {};

      const commentsList = sortType === SORT_BY_NEWEST ? [...order].reverse() : order;

      for (const commentId of commentsList) {
        const comment = comments[commentId];

        const parentContentId = comment.parent.comment ? comment.parent.comment.contentId : null;

        let target = {
          ...root,
        };

        if (parentContentId) {
          const parentId = formatContentId(parentContentId);

          target = nodes[parentId] ? nodes[parentId] : target;

          if (target && target.level === MAX_COMMENTS_DEPTH) {
            target = nodes[target.parentId];
          }
        }

        const node = {
          commentId: comment.id,
          parentId: target.commentId,
          level: target.level + 1,
          children: [],
        };

        nodes[comment.id] = node;

        target.children.push(node);
      }

      for (const node of Object.values(nodes)) {
        // Used only for build structure
        delete node.parentId;
      }

      return sortType === SORT_BY_NEWEST ? [...root.children].reverse() : root.children;
    }
  );
