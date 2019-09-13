import React from 'react';

import { Router, Link } from 'shared/routes';

export const ROUTES_WITH_USER = ['profile', 'profileSection', 'feed', 'post', 'postRedirect'];

export function normalizeRouteParams(route, params) {
  const finalParams = { ...params };
  let finalRoute = route;

  if (params.username) {
    delete finalParams.userId;
  } else if (params.userId) {
    finalRoute += '~';
    delete finalParams.username;
  } else {
    return null;
  }

  return {
    route: finalRoute,
    params: finalParams,
  };
}

export function getUserRoute({ userId, username }) {
  if (username) {
    return `@${username}`;
  }

  return `~${userId}`;
}

export function pushRoute(route, params) {
  let routeParams;

  if (ROUTES_WITH_USER.includes(route)) {
    routeParams = normalizeRouteParams(route, params);
  } else {
    routeParams = { route, params };
  }

  if (!routeParams) {
    console.error(`pushRoute failed, invalid route "${route}" params:`, params);
    return;
  }

  Router.pushRoute(routeParams.route, routeParams.params);
}

export default function SmartLink({ route, params, comment, commentUsername, hash, children }) {
  if (ROUTES_WITH_USER.includes(route)) {
    const routeParams = normalizeRouteParams(route, params);

    if (!routeParams) {
      console.error('Link without user:', params);
      return children;
    }

    if (route === 'post' && comment) {
      let userPart;

      if (commentUsername) {
        userPart = `@${commentUsername}`;
      } else {
        userPart = `~${comment.userId}`;
      }

      hash = `${userPart}/${comment.permlink}`;
    }

    return (
      <Link {...routeParams} hash={hash} passHref>
        {children}
      </Link>
    );
  }

  return (
    <Link route={route} params={params} hash={hash} passHref>
      {children}
    </Link>
  );
}
