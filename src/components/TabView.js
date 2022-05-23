import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Routes,
  Route,
  Link as RouterLink,
  useLocation,
} from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  tabContainer: {
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
  const location = useLocation();

  const {
    basePath,
    onTabConfig,
    onTabMount,
    onTabUnmount,
    onUpdate,
    tabArrangement,
    ...rest
  } = props;

  const currentLocationPath = location.pathname;

  const [selectedTabIndex, setSelectedTabIndex] = useState(false);
  const [activeTabConfig, setActiveTabConfig] = useState(null);
  const activeTabViewRef = useRef(null);

  useEffect(() => {
    tabArrangement.forEach((tabConfig, tabIndex) => {
      if (currentLocationPath === tabConfig.path) {
        setSelectedTabIndex(tabIndex);
      }
    });
  }, [currentLocationPath, tabArrangement]);


  useEffect(() => {
    if (selectedTabIndex !== null) {
      setActiveTabConfig(tabArrangement[selectedTabIndex]);
    }
  }, [tabArrangement, selectedTabIndex]);


  const handleTabChange = useCallback((e, index) => {
    if (onTabUnmount) {
      onTabUnmount(activeTabConfig);
    }
  }, [activeTabConfig, onTabUnmount]);


  const handleTabMount = useCallback((tabContext) => {
    if (onTabMount) {
      onTabMount({
        ...activeTabConfig,
        ...tabContext
      });
    }
  }, [activeTabConfig, onTabMount]);

  const handleTabConfig = useCallback((tabContext) => {
    if (onTabConfig) {
      onTabConfig({
        ...activeTabConfig,
        ...tabContext
      });
    }
  }, [activeTabConfig, onTabConfig]);


  const tabContainerClasses = [classes.tabContainer];
  if (activeTabConfig) {
    tabContainerClasses.push(activeTabConfig.containerClassName);
  }

  return (
    <div className={classes.container}>
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
            component={RouterLink}
            to={tabConfig.path}
            label={tabConfig.label}
          />
        ))}
      </Tabs>


      <div className={clsx(tabContainerClasses)} ref={activeTabViewRef}>
        <Routes>
          {tabArrangement.map((tabConfig) => {
            const Component = tabConfig.component;
            const componentProps = tabConfig.componentProps || {};
            const routePath = tabConfig.path;

            return (
              <Route
                key={routePath}
                path={routePath.substring(routePath.indexOf(basePath))}
                element={(
                  <Component
                    containerRef={activeTabViewRef}
                    onConfig={handleTabConfig}
                    onMount={handleTabMount}
                    onUpdate={onUpdate}
                    {...componentProps}
                    {...rest}
                  />
                )}
              />
            );
          })}
        </Routes>
      </div>
    </div>
  );
}

TabView.propTypes = {
  onUpdate: PropTypes.func,
  onTabMount: PropTypes.func,
  onTabConfig: PropTypes.func,
  onTabUnmount: PropTypes.func,
  tabArrangement: PropTypes.array.isRequired,
};

export default TabView;
