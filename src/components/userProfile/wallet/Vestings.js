import React from 'react';

import VestingsList from './vestings/VestingsList';

export default function Vestings({ userId }) {
  return <VestingsList userId={userId} />;
}
