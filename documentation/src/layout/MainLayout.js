import React, { lazy, useContext, useState } from 'react';

import HomeIcon from '@material-ui/icons/Home';

import BaseLayout from './BaseLayout';

import AppContext from 'AppContext';
import paths from 'paths';

const WelcomePage = lazy(() => import('pages/WelcomePage'));

const routes = [
  { path: paths.index, component: WelcomePage },
];

function MainLayout(props) {
  const context = useContext(AppContext);
  const [navLinkArrangement, setNavLinkArrangement] = useState([]);

  const initialize = () => {
    return new Promise((resolve, reject) => {
      // context.update({ loadProgress: undefined });

      setNavLinkArrangement([
        {
          title: 'Home',
          path: paths.index,
          Icon: HomeIcon,
        },
      ]);

      context.update({ loadProgress: null });
      resolve();
    });
  };

  return (
    <BaseLayout
      initialize={initialize}
      navLinkArrangement={navLinkArrangement}
      redirectPath={paths.index}
      routes={routes}
      {...props}
    />
  );
}

export default MainLayout;
