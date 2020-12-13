import PropTypes from 'prop-types';

import React, { lazy, useContext, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import { useTheme } from '@material-ui/core/styles';

import SplitView from '@material-appkit/core/components/SplitView';
import { useInit } from '@material-appkit/core/util/hooks';
import { isValue } from '@material-appkit/core/util/value';

import ApplicationBar from 'layout/ApplicationBar';

import AppContext from 'AppContext';
import paths from 'paths';


const routes = [
  { path: paths.index, component: lazy(() => import('pages/IndexPage')) },
];

function StandardLayout(props) {
  const context = useContext(AppContext);
  const theme = useTheme();

  const {
    initialize,
    onMount,
    onUnmount,
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

  const handleViewControllerMount = (viewController) => {
    context.update({ pageTitle: viewController.props.title });
  };


  return (
    <SplitView
      bar={<ApplicationBar />}
      barSize={theme.topbar.height}
      placement="top"
    >
      <Container
        disableGutters
        maxWidth={props.maxWidth}
      >
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
                  <routeInfo.component
                    location={props.location}
                    match={routeProps.match}
                    onMount={handleViewControllerMount}
                  />
                )}
              />
            );
          })}
          <Redirect to={paths.index} />
        </Switch>
      </Container>
    </SplitView>
  );
}

StandardLayout.propTypes = {
  initialize: PropTypes.func,
  location: PropTypes.object.isRequired,
  maxWidth: PropTypes.string,
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
};

StandardLayout.defaultProps = {
  maxWidth: 'lg',
};

export default StandardLayout;
