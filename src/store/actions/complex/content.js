/* eslint-disable no-param-reassign */
import { FETCH_PAGE_POST, FETCH_PAGE_POST_SUCCESS, FETCH_PAGE_POST_ERROR } from 'store/constants';
import { createmssg, updatemssg } from 'store/actions/cyberway/publish';
import { fetchPost } from 'store/actions/gate';
import { deletemssg } from '../cyberway';

export const createPost = ({
  permlink,
  title,
  body,
  tags,
  jsonmetadata,
  resources,
  curationPercent,
}) => {
  const data = {
    message_id: {
      permlink,
    },
    headermssg: title,
    bodymssg: body,
    tags,
    jsonmetadata: JSON.stringify({
      ...jsonmetadata,
    }),
    curators_prcnt: curationPercent,
  };

  // prepare jsonmedata with embeds by iframely data
  if (resources) {
    data.jsonmetadata = JSON.stringify({
      ...jsonmetadata,
      embeds: resources,
    });
  }

  return createmssg(data);
};

export const updatePost = ({ contentId, title, body, tags, jsonmetadata, resources }) => {
  const data = {
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    headermssg: title,
    bodymssg: body,
    tags,
    jsonmetadata: JSON.stringify(jsonmetadata),
  };

  // prepare jsonmetadata with embeds by iframely data
  if (resources) {
    data.jsonmetadata = JSON.stringify({
      ...jsonmetadata,
      embeds: resources,
    });
  }

  return updatemssg(data);
};

export const createComment = ({ contentId, body, jsonmetadata, resources, curationPercent }) => {
  const data = {
    message_id: {
      permlink: `re-${contentId.permlink}-${Date.now()}`,
    },
    parent_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    bodymssg: body,
    jsonmetadata: JSON.stringify(jsonmetadata),
    curators_prcnt: curationPercent,
  };

  // prepare jsonmetadata with embeds by iframely data
  if (resources) {
    data.jsonmetadata = JSON.stringify({
      ...jsonmetadata,
      embeds: resources,
    });
  }

  return createmssg(data);
};

export const updateComment = ({ contentId, body, jsonmetadata, resources }) => {
  const data = {
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
    headermssg: '',
    bodymssg: body,
    jsonmetadata: JSON.stringify(jsonmetadata),
  };

  // prepare jsonmetadata with embeds by iframely data
  if (resources) {
    data.jsonmetadata = JSON.stringify({
      ...jsonmetadata,
      embeds: resources,
    });
  }

  return updatemssg(data);
};

export const deleteComment = contentId => {
  const data = {
    message_id: {
      author: contentId.userId,
      permlink: contentId.permlink,
    },
  };

  return deletemssg(data);
};

export const fetchPagePost = ({ userId, username, permlink }) => async dispatch => {
  dispatch({
    type: FETCH_PAGE_POST,
    payload: {},
  });

  try {
    const post = await dispatch(fetchPost({ userId, username, permlink }));

    dispatch({
      type: FETCH_PAGE_POST_SUCCESS,
      payload: post,
    });

    return post;
  } catch (err) {
    if (err.code !== 404) {
      // eslint-disable-next-line no-console
      console.error('Post fetch failed:', err);
    }

    dispatch({
      type: FETCH_PAGE_POST_ERROR,
      payload: err,
    });
  }
};
