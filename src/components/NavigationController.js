import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';

import React, {
  Fragment,
  useRef,
  useState,
} from 'react';
import { Route, Link as RouterLink } from 'react-router-dom';

import { Tabs, TabPanel } from 'react-tabs';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Link from '@material-ui/core/Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import NavigationControllerTab from './NavigationControllerTab';
import NavigationControllerBreadcrumbs from './NavigationControllerBreadcrumbs';

const styles = makeStyles((theme) => ({
  breadcrumbButton: {
    minWidth: 'initial',
  },

  navBar: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    height: theme.sizes.navigationController.navbarHeight,
    paddingLeft: theme.spacing(2),
  },

  navBarBreadcrumbs: {
    flexGrow: 1,
  },

  tabPanel: {
    height: '100%',
    overflow: 'auto',
  },

  toolBar: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    height: theme.sizes.navigationController.toolbarHeight,
  },
}));

function NavigationController(props) {
  const { matches } = props;
  const theme = useTheme();
  const classes = styles();

  const contextMenuAnchorRef = useRef(null);
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);

  const [topbarConfigMap, setTopbarConfigMap] = useState({});


  const createContextMenuItem = (menuItemConfig) => {
    const menuItemProps = {
      className: classes.contextMenuItem,
      key: menuItemConfig.key,
      onClick: () => { handleContextMenuClick(menuItemConfig); },
    };
    if (menuItemConfig.link) {
      menuItemProps.to = menuItemConfig.link;
      menuItemProps.component = Link;
    }
    return (
      <MenuItem {...menuItemProps}>
        {menuItemConfig.icon &&
          <ListItemIcon className={classes.contextMenuIcon}>
            <menuItemConfig.icon />
          </ListItemIcon>
        }
        <ListItemText primary={menuItemConfig.title} className={classes.contextMenuText} />
      </MenuItem>
    );
  };


  const breadcrumbs = matches.map((match, i) => {
    let title = '';
    const topbarConfig = topbarConfigMap[match.path];
    if (topbarConfig && topbarConfig.title) {
      title = topbarConfig.title;
    }

    let tabComponent = null;

    if (i < matches.length - 1) {
      tabComponent = (
        <Button
          className={classes.breadcrumbButton}
          component={RouterLink}
          to={match.url}
        >
          {title}
        </Button>
      );
    } else {
      if (topbarConfig && topbarConfig.contextMenuItems) {
        tabComponent = (
          <Fragment>
            <Button
              className={classes.breadcrumbButton}
              endIcon={<ExpandMoreIcon />}
              onClick={() => { setContextMenuIsOpen(prevOpen => !prevOpen); }}
              ref={contextMenuAnchorRef}
            >
              {title}
            </Button>
            <Popper
              open={contextMenuIsOpen}
              anchorEl={contextMenuAnchorRef.current}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper className={classes.contextMenuPaper}>
                    <ClickAwayListener onClickAway={handleContextMenuClose}>
                      <MenuList>
                        {topbarConfig.contextMenuItems.map(createContextMenuItem)}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Fragment>
        );
      } else {
        tabComponent = (
          <Button className={classes.breadcrumbButton}>
            {title}
          </Button>
        );
      }
    }

    return (
      <NavigationControllerTab key={match.path} className={classes.tab}>
        {tabComponent}
      </NavigationControllerTab>
    );
  });



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



  const handleContextMenuClick = (menuItemConfig) => {
    if (menuItemConfig.onClick) {
      menuItemConfig.onClick(menuItemConfig);
    }
    setContextMenuIsOpen(false);
  };



  const handleContextMenuClose = (event) => {
    if (contextMenuAnchorRef.current && contextMenuAnchorRef.current.contains(event.target)) {
      return;
    }

    setContextMenuIsOpen(false);
  };



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
    <Tabs
      forceRenderTabPanel={true}
      selectedIndex={selectedIndex}
      onSelect={() => {}}
    >
      <AppBar
        style={appBarStyle}
        color="default"
        elevation={0}
        position="static"
      >
        <Toolbar className={classes.navBar} disableGutters>
          <NavigationControllerBreadcrumbs
            className={classes.navBarBreadcrumbs}
            separator="›"
          >
            {breadcrumbs}
          </NavigationControllerBreadcrumbs>
          {rightBarItem}
        </Toolbar>

        {contextToolbar}
      </AppBar>

      <Box style={tabPanelContainerStyle}>
        {matches.map((match, i) => (
          <TabPanel
            key={match.path}
            className={classes.tabPanel}
            style={{ display: (i === selectedIndex) ? 'block' : 'none' }}
          >
            <Route
              key={match.path}
              path={match.path}
              render={(props) => {
                return (
                  <match.component
                    onAppear={viewDidAppear}
                    onMount={viewDidMount}
                    onUnmount={viewWillUnmount}
                    onUpdate={viewDidUpdate}
                    mountPath={match.path}
                    {...props}
                  />
                );
              }}
            />
          </TabPanel>
        ))}
      </Box>
    </Tabs>
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
