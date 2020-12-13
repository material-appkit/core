import React, { lazy, useContext } from 'react';


import NavigationControllerLayout from './NavigationControllerLayout';

import AppContext from 'AppContext';
import paths from 'paths';

const ReferenceIndexPage = lazy(() => import('pages/ReferenceIndexPage'));

const routes = [
  { path: paths.reference.index, component: ReferenceIndexPage },
];

function ReferenceLayout(props) {
  const context = useContext(AppContext);

  const initialize = () => {
    return new Promise((resolve, reject) => {
      // context.update({ loadProgress: undefined });

      context.update({ loadProgress: null });
      resolve();
    });
  };

  return (
    <NavigationControllerLayout
      initialize={initialize}
      redirectPath={paths.reference.index}
      routes={routes}
      {...props}
    />
  );
}

export default ReferenceLayout;
