import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';

import { useTheme } from '@material-ui/core/styles';

import NavigationController from '@material-appkit/core/components/NavigationController';
import NavManager from '@material-appkit/core/managers/NavManager';
import SplitView from '@material-appkit/core/components/SplitView';

import { matchesForPath } from '@material-appkit/core/util/urls';

import { usePrevious, useInit } from '@material-appkit/core/util/hooks';

import AppContext from 'AppContext';

import ApplicationBar from 'layout/ApplicationBar';

//------------------------------------------------------------------------------

function BaseLayout(props) {
  const context = useContext(AppContext);
  const theme = useTheme();

  const [initialized, setInitialized] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const [matches, setMatches] = useState([]);
  const prevMatches = usePrevious(matches);

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
    if (props.location !== currentLocation) {
      const pathMatches = matchesForPath(props.location.pathname, props.routes);

      // If there isn't a single path that matches, redirect to the dashboard
      if (!pathMatches.length) {
        NavManager.navigate(props.redirectPath, null, true);
      } else {
        if (pathMatches !== prevMatches) {
          setCurrentLocation(props.location);
          setMatches(pathMatches);
        }
      }
    }
  }, [
    props.location,
    props.redirectPath,
    props.routes,
    currentLocation,
    prevMatches,
  ]);


  const handleViewDidAppear = (viewController) => {
    context.update({ pageTitle: viewController.props.title });
  };

  // ---------------------------------------------------------------------------
  let contentView = null;

  if (initialized) {
    contentView = (
      <NavigationController
        location={props.location}
        matches={matches}
        onViewDidAppear={handleViewDidAppear}
      />
    );
  }

  return (
    <SplitView
      bar={(
        <ApplicationBar
          navLinkArrangement={props.navLinkArrangement}
        />
      )}
      barSize={theme.topbar.height}
      placement="top"
    >
      {contentView}
    </SplitView>
  );
}

BaseLayout.propTypes = {
  redirectPath: PropTypes.string.isRequired,
  initialize: PropTypes.func,
  location: PropTypes.object.isRequired,
  navLinkArrangement: PropTypes.array,
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
};

export default BaseLayout;
