/**
*
* TabView
*
*/

import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

class TabView extends React.PureComponent {
  get selectedTabIndex() {
    let selectedTabIndex = 0;
    const currentLocationPath = this.props.location.pathname;
    this.props.tabArrangement.forEach((tabConfig, tabIndex) => {
      if (currentLocationPath === tabConfig.url) {
        selectedTabIndex = tabIndex;
      }
    });
    return selectedTabIndex;
  }

  render() {
    const { classes, ...rest } = this.props;

    const selectedTabIndex = this.selectedTabIndex;
    const activeTabConfig = this.props.tabArrangement[selectedTabIndex];

    return (
      <React.Fragment>
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
              key={tabConfig.url}
              component={Link}
              to={tabConfig.url}
              label={tabConfig.label}
            />
          ))}
        </Tabs>
        <activeTabConfig.component {...rest} />
      </React.Fragment>
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
