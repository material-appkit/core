import PropTypes from 'prop-types';
import React from 'react';
import { Route, Link } from 'react-router-dom';

import { diff } from 'deep-object-diff';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

class NavigationController extends React.Component {
  constructor(props) {
    super(props);

    this.topbarConfigMap = new Map();
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
        tabComponent = <Link to={match.url}>{title}</Link>;
      } else {
        tabComponent = <span className={classes.activeTitle}>{title}</span>;
      }

      return (
        <Tab key={match.path} className={this.props.classes.tab}>
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

  updateTopbarConfig(viewControllerProps, path) {
    const topbarConfig = this.topbarConfigMap.get(path);

    const newTopbarConfig = {
      title: viewControllerProps.title,
      rightBarItem: viewControllerProps.rightBarItem,
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
            <TabList>{this.tabs}</TabList>
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
