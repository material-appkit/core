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
    onMount,
    onUnmount,
    onTabMount,
    onTabUnmount,
    onTabChange,
    onTabConfig,
    onUpdate,
    tabArrangement,
    ...rest
  } = props;

  const currentLocationPath = location.pathname;

  const [selectedTabIndex, setSelectedTabIndex] = useState(false);
  const [activeTabConfig, setActiveTabConfig] = useState(null);
  const activeTabViewRef = useRef(null);

  useEffect(() => {
    if (onMount) {
      onMount();
    }

    return () => {
      if (onUnmount) {
        onUnmount();
      }
    }
  }, [onMount, onUnmount]);

  useEffect(() => {
    tabArrangement.forEach((tabConfig, tabIndex) => {
      if (currentLocationPath === tabConfig.path) {
        setSelectedTabIndex(tabIndex);
      }
    });
  }, [currentLocationPath, tabArrangement]);


  useEffect(() => {
    let _activeTabConfig = null;
    if (selectedTabIndex !== false) {
      _activeTabConfig = tabArrangement[selectedTabIndex];
    }
    setActiveTabConfig(_activeTabConfig);
  }, [selectedTabIndex, tabArrangement]);


  const handleTabChange = useCallback((e, index) => {
    if (onTabChange) {
      onTabChange(tabArrangement[index]);
    }

    if (onTabConfig) {
      onTabConfig(tabArrangement[index]);
    }
  }, [onTabChange, onTabConfig, tabArrangement]);


  const handleTabMount = useCallback((tabContext) => {
    if (onTabMount) {
      onTabMount(tabContext);
    }
  }, [activeTabConfig, onTabMount]);

  const handleTabUnmount = useCallback((tabContext) => {
    if (onTabUnmount) {
      onTabUnmount(tabContext);
    }
  }, [activeTabConfig, onTabUnmount]);

  const handleTabConfig = useCallback((tabContext) => {
    if (onTabConfig) {
      onTabConfig({
        ...(activeTabConfig || {}),
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
                    onUnmount={handleTabUnmount}
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
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onTabMount: PropTypes.func,
  onTabUnmount: PropTypes.func,
  onTabConfig: PropTypes.func,
  onTabChange: PropTypes.func,
  tabArrangement: PropTypes.array.isRequired,
};

export default TabView;
