import PropTypes from 'prop-types';

import React, { Suspense, useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// import ContextMenu from './ContextMenu';
import SplitView from './SplitView';
// import NavigationControllerBreadcrumbs from './NavigationControllerBreadcrumbs';

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
  const {
    defaultRoute,
    onViewDidMount,
    onViewDidUpdate,
    onViewWillUnmount,
    routes,
    setPageTitle,
    splitViewProps,
  } = props;

  const theme = useTheme();
  const classes = styles();

  const [contextMenuButtonEl, setContextMenuButtonEl] = useState(null);
  const [toolbarItems, setToolbarItems] = useState([]);


  // const updateTopbarConfig = (viewControllerProps, path) => {
  //   const topbarConfig = topbarConfigMap[path];
  //
  //   const newTopbarConfig = {
  //     title: viewControllerProps.title,
  //     rightBarItem: viewControllerProps.rightBarItem,
  //     toolbarItems: viewControllerProps.toolbarItems,
  //     contextMenuItems: viewControllerProps.contextMenuItems,
  //   };
  //
  //   if (!isEqual(newTopbarConfig, topbarConfig)) {
  //     const newTopbarConfigMap = { ...topbarConfigMap };
  //     newTopbarConfigMap[path] = newTopbarConfig;
  //     setTopbarConfigMap(newTopbarConfigMap);
  //   }
  // };


   const viewDidMount = (viewController, path) => {
     console.log('view did mount', path);
     if (viewController.props.title) {
       setPageTitle(viewController.props.title);
     }

    if (viewController.props.onViewDidMount) {
      viewController.props.onViewDidMount(path);
    }

    if (onViewDidMount) {
      onViewDidMount(viewController, path);
    }
  };


  const viewDidUpdate = (viewController, path) => {
    console.log('view did update', path);

    if (viewController.props.onViewDidUpdate) {
      viewController.props.onViewDidUpdate(path);
    }

    if (onViewDidUpdate) {
      onViewDidUpdate(viewController, path);
    }
  };


  const viewWillUnmount = (viewController, path) => {
    if (viewController.props.onViewWillUnmount) {
      viewController.props.onViewWillUnmount(path);
    }

    if (onViewWillUnmount) {
      onViewWillUnmount(viewController, path);
    }
  };


  // ---------------------------------------------------------------------------
  let appBarHeight = theme.navigationController.navbarHeight;

  let contextToolbar = null;
  // if (activeTopBarConfig.toolbarItems) {
  //   contextToolbar = (
  //     <Toolbar className={classes.toolBar} disableGutters variant="dense">
  //       {activeTopBarConfig.toolbarItems}
  //     </Toolbar>
  //   );
  //   appBarHeight += theme.navigationController.toolbarHeight;
  // }

  return (
    <SplitView
      bar={(
        <AppBar color="default" elevation={0} position="static">
          <Toolbar className={classes.navBar} disableGutters>
            {toolbarItems}
            {/*
            <NavigationControllerBreadcrumbs
              matches={[]}
              onContextMenuButtonClick={(e) => { setContextMenuButtonEl(e.currentTarget); }}
              separator="›"
              topbarConfigMap={{}}
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
            */}
          </Toolbar>

          {contextToolbar}
        </AppBar>
      )}
      barSize={appBarHeight}
      placement="top"
      {...splitViewProps}
    >
      <div className={classes.navigationControllerViewContainer}>
        <Routes>
          {routes.map((routeInfo) => {
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
                    setPageTitle={setPageTitle}
                    setToolbarItems={setToolbarItems}
                  />
                </Suspense>
              } />
            );
          })}

          <Route path="*" element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </div>
    </SplitView>
  );
}

NavigationController.propTypes = {
  defaultRoute: PropTypes.string,
  routes: PropTypes.array.isRequired,
  onViewDidMount: PropTypes.func,
  onViewDidUpdate: PropTypes.func,
  onViewWillUnmount: PropTypes.func,
  setPageTitle: PropTypes.func,
  splitViewProps: PropTypes.object,
};

NavigationController.defaultProps = {
  defaultRoute: '/',
  routes: [],
  splitViewProps: {},
};

export default NavigationController;
