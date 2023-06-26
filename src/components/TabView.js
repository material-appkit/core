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

import { lastPathComponent } from '../util/path';

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

  tabsDense: {
    [theme.breakpoints.up('md')]: {
      '& .MuiTab-root': {
        minWidth: 120,
      },
    },
  }
}));


function TabView(props) {
  const classes = styles();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    basePath,
    dense,
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
      if ((tabConfig.index && currentLocationPath === basePath) ||
          (`${basePath}/${tabConfig.path}` === currentLocationPath)
      ) {
        setSelectedTabIndex(tabIndex);
      }
    });
  }, [basePath, currentLocationPath, tabArrangement]);


  const activeTabConfig = useMemo(() => {
    if (selectedTabIndex === false) {
      return null;
    }

    return tabArrangement[selectedTabIndex];
  }, [selectedTabIndex, tabArrangement]);


  const handleTabChange = useCallback((e, tabIndex) => {
    const tabInfo = tabArrangement[tabIndex];
    const pathname = tabInfo.index ? basePath : `${basePath}/${tabInfo.path}`;
    navigate(`${pathname}?${searchParams.toString()}`);

    if (onTabChange) {
      onTabChange(tabInfo);
    }

    if (onTabConfig) {
      onTabConfig(tabInfo);
    }
  }, [
    basePath,
    onTabChange,
    onTabConfig,
    navigate,
    searchParams,
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
        className={clsx(classes.tabs, dense ? classes.tabsDense : null)}
        indicatorColor="primary"
        onChange={handleTabChange}
        scrollButtons="auto"
        textColor="primary"
        variant="scrollable"
      >
        {tabArrangement.map((tabConfig) => (
          <Tab
            key={tabConfig.index ? basePath : tabConfig.path}
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
      <Route
        path={lastPathComponent(basePath)}
        element={tabViewContainer}
      >
        {tabArrangement.map((tabConfig) => {
          const Component = tabConfig.component;
          const componentProps = tabConfig.componentProps || {};
          let routeProps;
          if (tabConfig.index) {
            routeProps = { key: basePath, index: true };
          } else {
            routeProps = { key: tabConfig.path, path: tabConfig.path };
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
  basePath: PropTypes.string,
  dense: PropTypes.bool,
  onUpdate: PropTypes.func,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onTabMount: PropTypes.func,
  onTabUnmount: PropTypes.func,
  onTabConfig: PropTypes.func,
  onTabChange: PropTypes.func,
  tabArrangement: PropTypes.array.isRequired,
};

TabView.defaultProps = {
  dense: false,
};


export default React.memo(TabView);
