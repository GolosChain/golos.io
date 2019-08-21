import React from 'react';

import ClaimList from './claim/ClaimList';

export default function Claim({ userId }) {
  return <ClaimList userId={userId} />;
}
