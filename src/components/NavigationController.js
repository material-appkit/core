import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import ContextMenu from './ContextMenu';
import SplitView from './SplitView';
import NavigationControllerBreadcrumbs from './NavigationControllerBreadcrumbs';

const styles = makeStyles((theme) => {
  const defaultNavigationControllerTheme = {
    navigationControllerViewContainer: {
      height: '100%',
    },

    viewControllerContainer: {
      height: '100%',
      overflow: 'auto',
    },

    navBar: {
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
      height: theme.navigationController.navbarHeight,
      padding: theme.spacing(0, 2),
    },

    toolBar: {
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
      height: theme.navigationController.toolbarHeight,
    },

    loadingProgressBar: {
      height: 2,
    },
  };

  if (theme.navigationController) {
    Object.assign(defaultNavigationControllerTheme, theme.navigationController);
  }

  return defaultNavigationControllerTheme;
});


function NavigationController(props) {
  const { matches } = props;

  const theme = useTheme();
  const classes = styles();

  const [contextMenuButtonEl, setContextMenuButtonEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [topbarConfigMap, setTopbarConfigMap] = useState({});
  const [activeTopBarConfig, setActiveTopBarConfig] = useState({});

  const viewControllerMapRef = useRef({});


  useEffect(() => {
    if (matches.length) {
      setSelectedIndex(matches.length - 1);
    } else {
      setSelectedIndex(null);
    }
  }, [matches]);


  useEffect(() => {
    if (selectedIndex !== null) {
      const currentPath = matches[selectedIndex].path;
      const viewController = viewControllerMapRef.current[currentPath];
      if (viewController) {
        viewDidAppear(viewController, currentPath);
      }
    }
  }, [selectedIndex]);


  useEffect(() => {
    if (selectedIndex !== null && selectedIndex < matches.length) {
      const activeMatch = matches[selectedIndex];
      setActiveTopBarConfig(topbarConfigMap[activeMatch.path] || {});
    }
  }, [selectedIndex, topbarConfigMap]);


  const updateTopbarConfig = (viewControllerProps, path) => {
    const topbarConfig = topbarConfigMap[path];

    const newTopbarConfig = {
      title: viewControllerProps.title,
      rightBarItem: viewControllerProps.rightBarItem,
      toolbarItems: viewControllerProps.toolbarItems,
      contextMenuItems: viewControllerProps.contextMenuItems,
    };

    if (!isEqual(newTopbarConfig, topbarConfig)) {
      const newTopbarConfigMap = { ...topbarConfigMap };
      newTopbarConfigMap[path] = newTopbarConfig;
      setTopbarConfigMap(newTopbarConfigMap);
    }
  };


   const viewDidMount = (viewController, path) => {
    viewControllerMapRef.current[path] = viewController;

    updateTopbarConfig(viewController.props, path);

    if (viewController.props.onViewDidMount) {
      viewController.props.onViewDidMount(path);
    }

    if (props.onViewDidMount) {
      props.onViewDidMount(viewController, path);
    }

    if (selectedIndex !== null && selectedIndex < matches.length) {
      const match = matches[selectedIndex];
      if (match.path === path) {
        viewDidAppear(viewController, path);
      }
    }
  };


  const viewDidAppear = (viewController, path) => {
    if (viewController.props.onViewDidAppear) {
      viewController.props.onViewDidAppear(path);
    }

    if (props.onViewDidAppear) {
      props.onViewDidAppear(viewController, path);
    }
  };


  const viewDidUpdate = (viewController, path) => {
    updateTopbarConfig(viewController.props, path);

    if (viewController.props.onViewDidUpdate) {
      viewController.props.onViewDidUpdate(path);
    }

    if (props.onViewDidUpdate) {
      props.onViewDidUpdate(viewController, path);
    }
  };


  const viewWillUnmount = (viewController, path) => {
    delete viewControllerMapRef.current[path];

    const newTopbarConfigMap = { ...topbarConfigMap };
    delete newTopbarConfigMap[path];
    setTopbarConfigMap(newTopbarConfigMap);

    if (viewController.props.onViewWillUnmount) {
      viewController.props.onViewWillUnmount(path);
    }

    if (props.onViewWillUnmount) {
      props.onViewWillUnmount(viewController, path);
    }
  };


  let appBarHeight = theme.navigationController.navbarHeight;

  let contextToolbar = null;
  if (activeTopBarConfig.toolbarItems) {
    contextToolbar = (
      <Toolbar className={classes.toolBar} disableGutters variant="dense">
        {activeTopBarConfig.toolbarItems}
      </Toolbar>
    );
    appBarHeight += theme.navigationController.toolbarHeight;
  }

  return (
    <SplitView
      bar={(
        <AppBar
          color="default"
          elevation={0}
          position="static"
        >
          <Toolbar className={classes.navBar} disableGutters>
            <NavigationControllerBreadcrumbs
              matches={props.matches}
              onContextMenuButtonClick={(e) => { setContextMenuButtonEl(e.currentTarget); }}
              separator="›"
              topbarConfigMap={topbarConfigMap}
            />

            {activeTopBarConfig.contextMenuItems &&
              <ContextMenu
                anchorEl={contextMenuButtonEl}
                id="context-menu"
                getContentAnchorEl={null}
                open={Boolean(contextMenuButtonEl)}
                onClose={() => { setContextMenuButtonEl(null); }}
                menuItemArrangement={activeTopBarConfig.contextMenuItems}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              />
            }

            {activeTopBarConfig.rightBarItem}
          </Toolbar>

          {contextToolbar}
        </AppBar>
      )}
      barSize={appBarHeight}
      placement="top"
      {...props.splitViewProps}
    >
      <div className={classes.navigationControllerViewContainer}>
        <Routes>
          {matches.map((routeInfo) => {
            const { path, Component } = routeInfo;
            const componentProps = routeInfo.componentProps || {};

            return (
              <Route key={path} path={path} element={
                <Suspense fallback={<LinearProgress className={classes.loadingProgressBar} />}>
                  <Component
                    {...componentProps}
                    onMount={viewDidMount}
                    onUnmount={viewWillUnmount}
                    onUpdate={viewDidUpdate}
                    mountPath={routeInfo.path}
                  />
                </Suspense>
              } />
            );
          })}
        </Routes>
      </div>
    </SplitView>
  );
}

NavigationController.propTypes = {
  matches: PropTypes.array.isRequired,
  onViewDidAppear: PropTypes.func,
  onViewDidMount: PropTypes.func,
  onViewDidUpdate: PropTypes.func,
  onViewWillUnmount: PropTypes.func,
  splitViewProps: PropTypes.object,
};

NavigationController.defaultProps = {
  matches: [],
  splitViewProps: {},
};

export default React.memo(NavigationController);
