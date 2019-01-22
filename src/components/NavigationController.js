import PropTypes from 'prop-types';
import React from 'react';
import { Route, Link } from 'react-router-dom';

import { diff } from 'deep-object-diff';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import AppBar from '@material-ui/core/AppBar';
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

class NavigationController extends React.Component {
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
      let contextMenu = null;

      if (i < matches.length - 1) {
        tabComponent = (
          <React.Fragment>
            <Button component={Link} to={match.url}>{title}</Button>
            <KeyboardArrowRightIcon/>
          </React.Fragment>
        );
      } else {
        tabComponent = (
          <React.Fragment>
            <Typography className={classes.activeBreadCrumb}>{title}</Typography>
            {this.createContextMenu(topbarConfig)}
          </React.Fragment>
        );
      }

      return (
        <Tab key={match.path} className={classes.tab}>
          {tabComponent}
        </Tab>
      );
    });
  }

  get rightBarItem() {
    if (this.props.matches.length) {
      const activeMatch = this.props.matches[this.props.matches.length - 1];
      const topbarConfig = this.topbarConfigMap.get(activeMatch.path);
      if (topbarConfig && topbarConfig.rightBarItem) {
        return topbarConfig.rightBarItem;
      }
    }

    return null;
  }

  createContextMenu = (topbarConfig) => {
    if (!(topbarConfig && topbarConfig.contextMenuItems)) {
      return null;
    }

    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  createContextMenuItem = (itemConfig) => {
    const { classes } = this.props;
    const menuItemProps = {
      className: classes.contextMenuItem,
      key: itemConfig.key,
      onClick: () => { this.handleContextMenuClick(itemConfig); },
    };
    if (itemConfig.link) {
      menuItemProps.to = itemConfig.link;
      menuItemProps.component = Link;
    }
    return (
      <MenuItem {...menuItemProps}>
        {itemConfig.icon &&
          <ListItemIcon className={classes.contextMenuIcon}>
            <itemConfig.icon />
          </ListItemIcon>
        }
        <ListItemText primary={itemConfig.title} />
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
      contextMenuItems: viewControllerProps.contextMenuItems,
    };

    if (Object.keys(diff(newTopbarConfig, topbarConfig)).length) {
      this.topbarConfigMap.set(path, newTopbarConfig);
      this.forceUpdate();
    }
  }

  viewControllerDidMount = (viewController, path) => {
    this.topbarConfigMap.set(path, {});
    this.updateTopbarConfig(viewController.props, path);
  };

  viewControllerWillUnmount = (viewController, path) => {
    this.topbarConfigMap.delete(path);
    this.forceUpdate();
  };

  viewControllerDidUpdate = (viewController, path) => {
    this.updateTopbarConfig(viewController.props, path);
  };

  render() {
    const { classes } = this.props;

    return (
      <Tabs
        className={classes.tabs}
        forceRenderTabPanel={true}
        selectedIndex={this.props.matches.length - 1}
        onSelect={() => {}}
      >
        <AppBar color="default" position="fixed" className={classes.appBar}>
          <Toolbar className={classes.toolBar} disableGutters>
            <TabList className={classes.tabList}>{this.tabs}</TabList>
            {this.rightBarItem}
          </Toolbar>
        </AppBar>

        <main className={classes.main}>
          {this.props.matches.map((match) => (
            <TabPanel key={match.path}>
              <Route
                key={match.path}
                path={match.path}
                render={(props) => {
                  return (
                    <match.component
                      onMount={this.viewControllerDidMount}
                      onUnmount={this.viewControllerWillUnmount}
                      onUpdate={this.viewControllerDidUpdate}
                      mountPath={match.path}
                      {...props}
                    />
                  );
                }}
              />
            </TabPanel>
          ))}
        </main>
      </Tabs>
    );
  }
}

NavigationController.propTypes = {
  classes: PropTypes.object.isRequired,
  matches: PropTypes.array.isRequired,
};

NavigationController.defaultProps = {
  matches: [],
};

export default withStyles(
  (theme) => (theme.navigationController)
)(NavigationController);
