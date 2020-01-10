import React, { useEffect } from 'react';

import { initGCE } from 'utils/googleSearchEngine';

export default function() {
  useEffect(() => {
    initGCE();
  });

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: '<div class="gcse-search"></div>',
      }}
    />
  );
}
