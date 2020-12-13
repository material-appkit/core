import PropTypes from 'prop-types';

import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { useInit } from '@material-appkit/core/util/hooks';
import { isValue } from '@material-appkit/core/util/value';

function BlankLayout(props) {
  const {
    initialize,
    onMount,
    onUnmount,
    routes,
  } = props;

  const [initialized, setInitialized] = useState(false);

  // Operations to perform when component initially mounts
  useInit(() => {
    onMount();

    if (initialize) {
      initialize().then(() => {
        setInitialized(true);
      });
    } else {
      setInitialized(true);
    }

    return () => {
      onUnmount();
    };
  });

  if (!initialized) {
    return null;
  }

  return (
    <Switch>
      {routes.map((routeInfo) => {
        let exact = true;
        if (isValue(routeInfo.exact)) {
          exact = routeInfo.exact;
        }
        return (
          <Route
            exact={exact}
            key={routeInfo.path}
            path={routeInfo.path}
            render={(routeProps) => (
              <routeInfo.Component
                location={props.location}
                match={routeProps.match}
              />
            )}
          />
        );
      })}
      <Redirect to={props.redirectPath} />
    </Switch>
  );
}

BlankLayout.propTypes = {
  initialize: PropTypes.func,
  location: PropTypes.object.isRequired,
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  redirectPath: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
};

export default BlankLayout;
