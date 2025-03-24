import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Outlet, Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import { lstrip, rstrip } from '../util/string';


const styles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },

  tabContainer: {
    flex: 1,
    overflow: 'auto',
    overscrollBehavior: 'contain',
  },

  tabs: {
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    zIndex: theme.zIndex.appBar,
  },

  tab: {
    [theme.breakpoints.down('md')]: {
      minWidth: 90,
    },
  }
}));


function TabView(props) {
  const classes = styles();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    onMount,
    onUnmount,
    onTabMount,
    onTabUnmount,
    onTabChange,
    onTabConfig,
    onUpdate,
    tabArrangement,
    tabsProps,
    ...rest
  } = props;

  // ASSUME: the first tab is the index route
  const basePath = tabArrangement[0].path;
  const currentLocationPath = location.pathname;

  const [selectedTabIndex, setSelectedTabIndex] = useState(false);
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
    let tabIndex = 0;
    for (const tabConfig of tabArrangement) {
      if (tabConfig.path.startsWith(currentLocationPath)) {
        setSelectedTabIndex(tabIndex);
        return;
      }
      tabIndex++;
    }
  }, [currentLocationPath, tabArrangement]);

  const activeTabConfig = useMemo(() => {
    if (selectedTabIndex === false) {
      return null;
    }

    return tabArrangement[selectedTabIndex];
  }, [selectedTabIndex, tabArrangement]);


  const handleTabChange = useCallback((e, tabIndex) => {
    if (tabIndex === selectedTabIndex) {
      return;
    }

    const tabInfo = tabArrangement[tabIndex];
    const pathname = rstrip(tabInfo.path, '*');
    navigate(`${pathname}?${searchParams.toString()}`);

    if (onTabChange) {
      onTabChange(tabInfo);
    }

    if (onTabConfig) {
      onTabConfig(tabInfo);
    }
  }, [
    onTabChange,
    onTabConfig,
    navigate,
    searchParams,
    selectedTabIndex,
    tabArrangement
  ]);


  const handleTabMount = useCallback((tabContext) => {
    if (onTabMount) {
      onTabMount(tabContext);
    }
  }, [onTabMount]);

  const handleTabUnmount = useCallback((tabContext) => {
    if (onTabUnmount) {
      onTabUnmount(tabContext);
    }
  }, [onTabUnmount]);

  const handleTabConfig = useCallback((tabContext) => {
    if (onTabConfig) {
      onTabConfig({
        ...(activeTabConfig || {}),
        ...tabContext
      });
    }
  }, [activeTabConfig, onTabConfig]);


  // ---------------------------------------------------------------------------

  const tabContainerClasses = [classes.tabContainer];
  if (activeTabConfig) {
    tabContainerClasses.push(activeTabConfig.containerClassName);
  }

  const tabViewContainer = (
    <div className={classes.container}>
      <Tabs
        value={selectedTabIndex}
        className={classes.tabs}
        indicatorColor="primary"
        onChange={handleTabChange}
        scrollButtons="auto"
        textColor="primary"
        {...tabsProps}
      >
        {tabArrangement.map((tabConfig) => (
          <Tab
            className={classes.tab}
            key={tabConfig.path}
            label={tabConfig.label}
          />
        ))}
      </Tabs>

      <div className={clsx(tabContainerClasses)}>
        <Outlet />
      </div>
    </div>
  );

  return (
    <Routes>
      <Route element={tabViewContainer}>
        {tabArrangement.map((tabConfig) => {
          const Component = tabConfig.component;
          const componentProps = tabConfig.componentProps || {};
          const routeProps = { key: tabConfig.path };
          if (tabConfig.index) {
            routeProps.index = true;
          } else {
            routeProps.path = lstrip(lstrip(tabConfig.path, basePath), '/');
          }

          return (
            <Route
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
              {...routeProps}
            />
          );
        })}
      </Route>
    </Routes>
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
  tabsProps: PropTypes.object,
};

TabView.defaultProps = {
  tabsProps: {
    variant: 'scrollable',
  },
};


export default React.memo(TabView);
