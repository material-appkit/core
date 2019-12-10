import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import SplitView from './SplitView';

const styles = makeStyles((theme) => ({
  tabs: {
    backgroundColor: theme.palette.grey[50],
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
}));


function TabView(props) {
  const {
    onConfig,
    onTabUnmount,
    onTabMount,
    onSave,
    tabArrangement,
    ...rest
  } = props;


  let initialTabIndex = 0;
  const currentLocationPath = props.location.pathname;
  tabArrangement.forEach((tabConfig, tabIndex) => {
    if (currentLocationPath === tabConfig.path) {
      initialTabIndex = tabIndex;
    }
  });

  const [selectedTabIndex, setSelectedTabIndex] = useState(initialTabIndex);

  const activeTabConfig = tabArrangement[selectedTabIndex];

  useEffect(() => {
    if (onConfig) {
      onConfig({
        selectedTabIndex,
        ...activeTabConfig
      });
    }

  }, [selectedTabIndex]);


  const handleTabChange = (e, index) => {
    if (onTabUnmount) {
      onTabUnmount(activeTabConfig);
    }

    setSelectedTabIndex(index);
  };


  const handleTabMount = (tabContext) => {
    if (onTabMount) {
      onTabMount({
        ...activeTabConfig,
        ...tabContext
      });
    }
  };


  const activeTabProps = activeTabConfig.componentProps || {};
  activeTabProps.mountPath = activeTabConfig.path;

  const classes = styles();

  return (
    <SplitView
      bar={(
        <Tabs
          value={selectedTabIndex}
          className={classes.tabs}
          indicatorColor="primary"
          onChange={handleTabChange}
          scrollButtons="auto"
          textColor="primary"
          variant="scrollable"
          {...rest}
        >
          {tabArrangement.map((tabConfig) => (
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
      scrollContent
    >
      <activeTabConfig.component
        onSave={onSave}
        onInit={handleTabMount}
        {...activeTabProps}
        {...rest}
      />
    </SplitView>
  );

}

TabView.propTypes = {
  location: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  onTabMount: PropTypes.func,
  onTabUnmount: PropTypes.func,
  tabArrangement: PropTypes.array.isRequired,
};

export default TabView;
