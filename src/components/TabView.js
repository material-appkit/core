import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  activeTabContainer: {
    flex: 1,
    overflow: 'auto',
  },

  tabs: {
    backgroundColor: theme.palette.grey[50],
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    position: 'relative',
    zIndex: theme.zIndex.appBar,
  },
}));



function TabView(props) {
  const classes = styles();

  const {
    location,
    onTabConfig,
    onTabMount,
    onTabUnmount,
    onUpdate,
    tabArrangement,
    ...rest
  } = props;


  const [selectedTabIndex, setSelectedTabIndex] = useState(null);
  const [activeTabConfig, setActiveTabConfig] = useState(null);
  const activeTabViewRef = useRef(null);

  useEffect(() => {
    const currentLocationPath = location.pathname;
    tabArrangement.forEach((tabConfig, tabIndex) => {
      if (currentLocationPath === tabConfig.path) {
        setSelectedTabIndex(tabIndex);
      }
    });
  }, [tabArrangement]);


  useEffect(() => {
    if (selectedTabIndex !== null) {
      setActiveTabConfig(tabArrangement[selectedTabIndex]);
    }
  }, [tabArrangement, selectedTabIndex]);


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

  const handleTabConfig = (tabContext) => {
    if (onTabConfig) {
      onTabConfig({
        ...activeTabConfig,
        ...tabContext
      });
    }
  };


  let activeTab = null;
  const activeTabContainerClassNames = [classes.activeTabContainer];
  if (activeTabConfig) {
    activeTab = (
      <activeTabConfig.component
        onConfig={handleTabConfig}
        onMount={handleTabMount}
        onUpdate={onUpdate}
        mountPath={activeTabConfig.path}
        containerRef={activeTabViewRef}
        {...(activeTabConfig.componentProps || {})}
        {...rest}
      />
    );

    activeTabContainerClassNames.push(activeTabConfig.containerClassName);
  }

  return (
    <div className={classes.container}>
      {(selectedTabIndex !== null) &&
        <Tabs
          value={selectedTabIndex}
          className={classes.tabs}
          indicatorColor="primary"
          onChange={handleTabChange}
          scrollButtons="auto"
          textColor="primary"
          variant="scrollable"
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
      }

      <div className={clsx(activeTabContainerClassNames)} ref={activeTabViewRef}>
        {activeTab}
      </div>
    </div>
  );
}

TabView.propTypes = {
  location: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
  onTabMount: PropTypes.func,
  onTabConfig: PropTypes.func,
  onTabUnmount: PropTypes.func,
  tabArrangement: PropTypes.array.isRequired,
};

export default TabView;
