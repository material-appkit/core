/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react';

import AppWrapper from './src/layout/AppWrapper';

export const wrapRootElement = ({ element }) => {
  return (
    <AppWrapper rootElement={element}>
      {element}
    </AppWrapper>
  );
};
