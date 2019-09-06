import React from 'react';

import { Link } from 'shared/routes';

const ROUTES_WITH_USER = ['profile', 'profileSection', 'feed', 'post', 'postRedirect'];

export default function SmartLink({ route, params, hash, children }) {
  if (ROUTES_WITH_USER.includes(route)) {
    const finalParams = { ...params };
    let finalRoute = route;

    if (params.username) {
      delete finalParams.userId;
    } else {
      finalRoute += '~';
      delete finalParams.username;
    }

    return (
      <Link route={finalRoute} params={finalParams} hash={hash} passHref>
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
