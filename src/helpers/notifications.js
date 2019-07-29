/* eslint-disable no-case-declarations, import/prefer-default-export, no-console */
import React from 'react';

import { formatContentId } from 'store/schemas/gate';
import { softTrim } from 'utils/text';
import Link from 'components/common/Link';

const TEXT_LIMIT = 50;

export function getPropsForInterpolation(notification) {
  const { actor, eventType, post, comment } = notification;
  const interProps = {};

  if (actor) {
    interProps.user = (
      <Link route="profile" params={{ username: actor.username }}>
        @{actor.username || actor.userId}
      </Link>
    );
  }

  switch (eventType) {
    case 'upvote':
    case 'downvote':
    case 'reply':
    case 'mention':
    case 'repost':
    case 'reward':
    case 'curatorReward':
      let text = (comment ? comment.body : post?.title) || null;

      if (post) {
        if (comment && post.contentId && comment.contentId) {
          text = comment?.body;
          const { contentId: postContentId } = post;
          const { contentId: commentContentId } = comment;
          interProps.content = (
            <Link
              route={`/@${formatContentId(postContentId)}#${formatContentId(commentContentId)}`}
            >
              {softTrim(text, TEXT_LIMIT)}
            </Link>
          );
        } else {
          interProps.content = (
            <Link route="post" params={notification.post.contentId}>
              {softTrim(text, TEXT_LIMIT)}
            </Link>
          );
        }
      } else if (text) {
        interProps.content = softTrim(text, TEXT_LIMIT);
      }
      break;
    default:
  }

  try {
    switch (eventType) {
      case 'reward':
      case 'curatorReward':
      case 'transfer':
        const { amount, currency } = notification.value;
        interProps.amount = `${amount} ${currency}`;
        break;
      default:
    }
  } catch (err) {
    console.error('Formatting failed:', err);
    interProps.amount = 'ERROR';
  }

  return interProps;
}
