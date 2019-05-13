import React from 'react';

import Guard from 'components/common/Guard';

export default translationKey => Comp => props => (
  <Guard translationKey={translationKey}>
    <Comp {...props} />
  </Guard>
);
