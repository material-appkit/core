import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { useWidth } from '@material-appkit/core/util/hooks';

import AppContext from 'AppContext';


function Application(props) {
  const [appContext, setAppContext] = useState({});

  return (
    <AppContext.Provider value={{
      ...appContext,
      breakpoint: useWidth(),
      update: (change) => {
        setAppContext({ ...appContext, ...change });
      },
    }}>
      {props.children}
    </AppContext.Provider>
  );
}

Application.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Application;
