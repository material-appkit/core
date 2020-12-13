import React from 'react';

import AppWrapper from './src/layout/AppWrapper';

export const wrapRootElement = ({ element }) => {
  return (
    <AppWrapper rootElement={element}>
      {element}
    </AppWrapper>
  );
};
