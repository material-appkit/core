/**
*
* TabView
*
*/

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

import SplitView from './SplitView';

class TabView extends React.PureComponent {
  get selectedTabIndex() {
    let selectedTabIndex = 0;
    const currentLocationPath = this.props.location.pathname;
    this.props.tabArrangement.forEach((tabConfig, tabIndex) => {
      if (currentLocationPath === tabConfig.path) {
        selectedTabIndex = tabIndex;
      }
    });
    return selectedTabIndex;
  }

  render() {
    const { classes, ...rest } = this.props;

    const selectedTabIndex = this.selectedTabIndex;
    const activeTabConfig = this.props.tabArrangement[selectedTabIndex];

    const activeTabProps = activeTabConfig.componentProps || {};
    activeTabProps.mountPath = activeTabConfig.path;

    return (
      <SplitView
        bar={(
          <Tabs
            value={this.selectedTabIndex}
            className={classes.tabs}
            indicatorColor="primary"
            scrollButtons="auto"
            textColor="primary"
            variant="scrollable"
          >
            {this.props.tabArrangement.map((tabConfig) => (
              <Tab
                key={tabConfig.path}
                component={Link}
                to={tabConfig.path}
                label={tabConfig.label}
              />
            ))}
          </Tabs>
        )}
        barSize={48}
        placement="top"
      >
        <activeTabConfig.component
          {...activeTabProps}
          {...rest}
        />
      </SplitView>
    );
  }
}

TabView.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  tabArrangement: PropTypes.array.isRequired,
};

export default withStyles({
  tabs: {
    backgroundColor: '#fafafa',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  tab: {
    padding: '0 10px',
  },
})(TabView);
