import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
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
import { withStyles } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

class NavigationController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.topbarConfigMap = new Map();

    this.state = {
      contextMenuAnchorEl: null,
      contextMenuIsOpen: false,
    };
  }

  get tabs() {
    const { classes } = this.props;

    const matches = this.props.matches;
    return matches.map((match, i) => {
      let title = '';
      const topbarConfig = this.topbarConfigMap.get(match.path);
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
            {this.createContextMenu(topbarConfig)}
          </Fragment>
        );
      }

      return (
        <Tab key={match.path} className={classes.tab}>
          {tabComponent}
        </Tab>
      );
    });
  }

  get activeTopBarConfig() {
    let topbarConfig = null;
    if (this.props.matches.length) {
      const activeMatch = this.props.matches[this.props.matches.length - 1];
      topbarConfig = this.topbarConfigMap.get(activeMatch.path);
    }
    return topbarConfig || {};
  }

  get rightBarItem() {
    return this.activeTopBarConfig.rightBarItem;
  }

  get toolbarItems() {
    return this.activeTopBarConfig.toolbarItems;
  }

  get contextToolbar() {
    const toolbarItems = this.toolbarItems;
    if (!toolbarItems) {
      return null;
    }

    return (
      <Toolbar
        className={this.props.classes.toolBar}
        disableGutters
        variant="dense"
      >
        {toolbarItems}
      </Toolbar>
    );
  }

  createContextMenu = (topbarConfig) => {
    if (!(topbarConfig && topbarConfig.contextMenuItems && topbarConfig.contextMenuItems.length)) {
      return null;
    }

    return (
      <Fragment>
        <IconButton onClick={(e) => { this.toggleContextMenu(e.target); }}>
          <MoreHorizIcon />
        </IconButton>
        <Popper
          open={this.state.contextMenuIsOpen}
          anchorEl={this.state.contextMenuAnchorEl}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={() => { this.toggleContextMenu(false); }}>
                  <MenuList>
                    {topbarConfig.contextMenuItems.map(this.createContextMenuItem)}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    );
  };

  createContextMenuItem = (menuItemConfig) => {
    const { classes } = this.props;
    const menuItemProps = {
      className: classes.contextMenuItem,
      key: menuItemConfig.key,
      onClick: () => { this.handleContextMenuClick(menuItemConfig); },
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

  handleContextMenuClick = (menuItemConfig) => {
    if (menuItemConfig.onClick) {
      menuItemConfig.onClick(menuItemConfig);
    }
    this.toggleContextMenu(false);
  };

  toggleContextMenu = (anchor) => {
    if (anchor) {
      this.setState({ contextMenuAnchorEl: anchor, contextMenuIsOpen: true });
    } else {
      this.setState({ contextMenuAnchorEl: null, contextMenuIsOpen: false });
    }
  };

  updateTopbarConfig(viewControllerProps, path) {
    const topbarConfig = this.topbarConfigMap.get(path);

    const newTopbarConfig = {
      title: viewControllerProps.title,
      rightBarItem: viewControllerProps.rightBarItem,
      toolbarItems: viewControllerProps.toolbarItems,
      contextMenuItems: viewControllerProps.contextMenuItems,
    };

    if (!isEqual(newTopbarConfig, topbarConfig)) {
      this.topbarConfigMap.set(path, newTopbarConfig);
      this.forceUpdate();
    }
  }

  viewDidMount = (viewController, path) => {
    this.topbarConfigMap.set(path, {});
    this.updateTopbarConfig(viewController.props, path);

    if (this.props.onViewDidMount) {
      this.props.onViewDidMount(viewController, path);
    }
  };

  viewDidUpdate = (viewController, path) => {
    this.updateTopbarConfig(viewController.props, path);

    if (this.props.onViewDidUpdate) {
      this.props.onViewDidUpdate(viewController, path);
    }
  };

  viewWillUnmount = (viewController, path) => {
    this.topbarConfigMap.delete(path);
    this.forceUpdate();

    if (this.props.onViewWillUnmount) {
      this.props.onViewWillUnmount(viewController, path);
    }
  };

  render() {
    const {
      classes,
      matches,
      theme,
    } = this.props;

    const selectedIndex = matches.length - 1;

    const contextToolbar = this.contextToolbar;

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
              {this.tabs}
            </TabList>
            {this.rightBarItem}
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
                      onMount={this.viewDidMount}
                      onUnmount={this.viewWillUnmount}
                      onUpdate={this.viewDidUpdate}
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
}

NavigationController.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  matches: PropTypes.array.isRequired,
  onViewDidMount: PropTypes.func,
  onViewDidUpdate: PropTypes.func,
  onViewWillUnmount: PropTypes.func,
};

NavigationController.defaultProps = {
  matches: [],
};

export default withStyles((theme) => (
  theme.navigationController
), { withTheme: true })(NavigationController);
