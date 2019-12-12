import PropTypes from 'prop-types';
import React, {
  Fragment,
  useRef,
  useState,
} from 'react';
import { Route, Link } from 'react-router-dom';

import isEqual from 'lodash.isequal';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const styles = makeStyles((theme) => (
  theme.navigationController
));

function NavigationController(props) {
  const classes = styles();
  const theme = useTheme();

  const [contextMenuAnchorEl, setContextMenuAnchorEl] = useState(null);
  const [contextMenuIsOpen, setContextMenuIsOpen] = useState(false);
  const [topbarConfigMap, setTopbarConfigMap] = useState({});


  const createTabs = () => {
    const matches = props.matches;
    return matches.map((match, i) => {
      let title = '';
      const topbarConfig = topbarConfigMap[match.path];
      if (topbarConfig && topbarConfig.title) {
        title = topbarConfig.title;
      }

      let tabComponent = null;

      if (i < matches.length - 1) {
        tabComponent = (
          <Fragment>
            <Button
              component={Link}
              to={match.url}
              classes={{
                root: classes.breadcrumbButton,
                label: classes.breadcrumbButtonLabel,
              }}
            >
              {title}
            </Button>
            <KeyboardArrowRightIcon/>
          </Fragment>
        );
      } else {
        tabComponent = (
          <Fragment>
            <Typography className={classes.activeTabTitle}>{title}</Typography>
            {createContextMenu(topbarConfig)}
          </Fragment>
        );
      }

      return (
        <Tab key={match.path} className={classes.tab}>
          {tabComponent}
        </Tab>
      );
    });
  };

  let activeTopBarConfig = {};
  if (props.matches.length) {
    const activeMatch = props.matches[props.matches.length - 1];
    activeTopBarConfig = topbarConfigMap[activeMatch.path] || {};
  }

  const rightBarItem = activeTopBarConfig.rightBarItem;
  const toolbarItems = activeTopBarConfig.toolbarItems;


  let contextToolbar = null;
  if (toolbarItems) {
    contextToolbar = (
      <Toolbar
        className={classes.toolBar}
        disableGutters
        variant="dense"
      >
        {toolbarItems}
      </Toolbar>
    );
  }

  const createContextMenu = (topbarConfig) => {
    if (!(topbarConfig && topbarConfig.contextMenuItems && topbarConfig.contextMenuItems.length)) {
      return null;
    }

    return (
      <Fragment>
        <IconButton onClick={(e) => { toggleContextMenu(e.target); }}>
          <MoreHorizIcon />
        </IconButton>
        <Popper
          open={contextMenuIsOpen}
          anchorEl={contextMenuAnchorEl}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={() => { toggleContextMenu(false); }}>
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
  };

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

  const handleContextMenuClick = (menuItemConfig) => {
    if (menuItemConfig.onClick) {
      menuItemConfig.onClick(menuItemConfig);
    }
    toggleContextMenu(false);
  };

  const toggleContextMenu = (anchor) => {
    if (anchor) {
      setContextMenuAnchorEl(anchor);
      setContextMenuIsOpen(true);
    } else {
      setContextMenuAnchorEl(null);
      setContextMenuIsOpen(false);
    }
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

  const { matches } = props;

  const selectedIndex = matches.length - 1;

  let appBarHeight = theme.navigationController.navBar.height;
  if (contextToolbar) {
    appBarHeight += theme.navigationController.toolBar.height;
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

  const tabs = createTabs();

  return (
    <Tabs
      className={classes.tabs}
      forceRenderTabPanel={true}
      selectedIndex={selectedIndex}
      onSelect={() => {}}
    >
      <AppBar
        className={classes.appBar}
        style={appBarStyle}
        color="default"
        elevation={0}
        position="static"
      >
        <Toolbar className={classes.navBar} disableGutters>
          <TabList className={classes.tabList}>
            {tabs}
          </TabList>
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
