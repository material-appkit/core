import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { useInit, useWidth } from '@material-appkit/core/util/hooks';

import AppContext from 'AppContext';


function Application(props) {
  const [appContext, setAppContext] = useState(() => ({
    qsParams: null,
  }));

  const [exchangeRates, setExchangeRates] = useState(null);

  useInit(() => {
    fetch('https://api.exchangeratesapi.io/latest?base=CAD&symbols=USD')
      .then(response => response.json())
      .then(data => {
        setExchangeRates(data.rates);
      });
  });

  return (
    <AppContext.Provider value={{
      ...appContext,
      breakpoint: useWidth(),
      exchangeRates,
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
