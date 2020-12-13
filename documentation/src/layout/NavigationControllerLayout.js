import isEqual from 'lodash.isequal';

import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';

import { useTheme } from '@material-ui/core/styles';

import NavigationController from '@material-appkit/core/components/NavigationController';
import NavManager from '@material-appkit/core/managers/NavManager';
import SplitView from '@material-appkit/core/components/SplitView';

import { matchesForPath } from '@material-appkit/core/util/urls';

import { useInit } from '@material-appkit/core/util/hooks';

import ApplicationBar from 'layout/ApplicationBar';

import AppContext from 'AppContext';


function NavigationControllerLayout(props) {
  const context = useContext(AppContext);
  const theme = useTheme();

  const {
    location,
    redirectPath,
    routes,
  } = props;

  const [initialized, setInitialized] = useState(false);

  const [matches, setMatches] = useState([]);

  // Operations to perform when component initially mounts
  useInit(async () => {
    props.onMount();

    if (props.initialize) {
      await props.initialize();
      setInitialized(true);
    } else {
      setInitialized(true);
    }

    return () => {
      props.onUnmount();
    };
  });

  useEffect(() => {
    const pathMatches = matchesForPath(location.pathname, routes);

    // If there isn't a single path that matches, redirect to the dashboard
    if (!pathMatches.length) {
      NavManager.navigate(redirectPath, null, true);
    } else if (!isEqual(pathMatches, matches)) {
      setMatches(pathMatches);
    }
  }, [location, matches, redirectPath, routes]);


  const handleViewDidAppear = (viewController) => {
    context.update({ pageTitle: viewController.props.title });
  };

  // ---------------------------------------------------------------------------
  let contentView = null;

  if (initialized) {
    contentView = (
      <NavigationController
        location={location}
        matches={matches}
        onViewDidAppear={handleViewDidAppear}
      />
    );
  }

  return (
    <SplitView
      bar={<ApplicationBar />}
      barSize={theme.topbar.height}
      placement="top"
    >
      {contentView}
    </SplitView>
  );
}

NavigationControllerLayout.propTypes = {
  redirectPath: PropTypes.string.isRequired,
  initialize: PropTypes.func,
  location: PropTypes.object.isRequired,
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
};

export default NavigationControllerLayout;
