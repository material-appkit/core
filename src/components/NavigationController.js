import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Route } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import ContextMenu from '@material-appkit/core/components/ContextMenu';
import NavigationControllerBreadcrumbs from './NavigationControllerBreadcrumbs';

const styles = makeStyles((theme) => {
  const defaultNavigationControllerTheme = {
    navBarBreadcrumbsRoot: {
      flex: 1,
    },

    navBarBreadcrumbsList: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridAutoColumns: 'minmax(20px, max-content)',
    },

    navBar: {
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
      height: theme.sizes.navigationController.navbarHeight,
      paddingLeft: theme.spacing(2),
    },

    tabPanel: {
      height: '100%',
      overflow: 'auto',
    },

    toolBar: {
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
      height: theme.sizes.navigationController.toolbarHeight,
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

  const [topbarConfigMap, setTopbarConfigMap] = useState({});

  let activeTopBarConfig = {};
  if (matches.length) {
    const activeMatch = matches[matches.length - 1];
    activeTopBarConfig = topbarConfigMap[activeMatch.path] || {};
  }

  const rightBarItem = activeTopBarConfig.rightBarItem;
  const toolbarItems = activeTopBarConfig.toolbarItems;


  let contextToolbar = null;
  if (toolbarItems) {
    contextToolbar = (
      <Toolbar className={classes.toolBar} disableGutters variant="dense">
        {toolbarItems}
      </Toolbar>
    );
  }


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
    updateTopbarConfig(viewController.props, path);

    if (viewController.props.onViewDidMount) {
      viewController.props.onViewDidMount(path);
    }

    if (props.onViewDidMount) {
      props.onViewDidMount(viewController, path);
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


  const selectedIndex = matches.length - 1;

  let appBarHeight = theme.sizes.navigationController.navbarHeight;
  if (contextToolbar) {
    appBarHeight += theme.sizes.navigationController.toolbarHeight;
  }

  const appBarStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: appBarHeight,
  };

  const tabPanelContainerStyle = {
    position: 'absolute',
    top: appBarHeight,
    left: 0,
    right: 0,
    bottom: 0,
  };

  return (
    <Fragment>
      <AppBar
        style={appBarStyle}
        color="default"
        elevation={0}
        position="static"
      >
        <Toolbar className={classes.navBar} disableGutters>
          <NavigationControllerBreadcrumbs
            classes={{
              root: classes.navBarBreadcrumbsRoot,
              ol: classes.navBarBreadcrumbsList,
            }}
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

          {rightBarItem}
        </Toolbar>

        {contextToolbar}
      </AppBar>

      <Box style={tabPanelContainerStyle}>
        {matches.map((routeInfo, i) => {
          const componentProps = routeInfo.componentProps || {};

          return (
            <Box
              key={routeInfo.path}
              className={classes.tabPanel}
              style={{ display: (i === selectedIndex) ? 'block' : 'none' }}
            >
              <Route
                key={routeInfo.path}
                path={routeInfo.path}
                render={(props) => (
                  <routeInfo.component
                    {...props}
                    {...componentProps}
                    onMount={viewDidMount}
                    onUnmount={viewWillUnmount}
                    onUpdate={viewDidUpdate}
                    mountPath={routeInfo.path}
                  />
                )}
              />
            </Box>
          );
        })}
      </Box>
    </Fragment>
  );
}

NavigationController.propTypes = {
  matches: PropTypes.array.isRequired,
  onViewDidAppear: PropTypes.func,
  onViewDidMount: PropTypes.func,
  onViewDidUpdate: PropTypes.func,
  onViewWillUnmount: PropTypes.func,
};

NavigationController.defaultProps = {
  matches: [],
};

export default NavigationController;
