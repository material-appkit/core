import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
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
    location,
    onTabConfig,
    onTabMount,
    onTabUnmount,
    onUpdate,
    tabArrangement,
    ...rest
  } = props;


  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [activeTabConfig, setActiveTabConfig] = useState(null);

  useEffect(() => {
    if (tabArrangement) {
      const currentLocationPath = location.pathname;
      tabArrangement.forEach((tabConfig, tabIndex) => {
        if (currentLocationPath === tabConfig.path) {
          setSelectedTabIndex(tabIndex);
        }
      });
    }
  }, [tabArrangement]);


  useEffect(() => {
    if (tabArrangement && selectedTabIndex !== null) {
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


  const classes = styles();

  return (
    <SplitView
      bar={(
        <Fragment>
          {tabArrangement &&
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
          }
        </Fragment>
      )}
      barSize={48}
      placement="top"
      scrollContent
    >
      {activeTabConfig &&
        <activeTabConfig.component
          onConfig={handleTabConfig}
          onMount={handleTabMount}
          onUpdate={onUpdate}
          mountPath={activeTabConfig.path}
          {...(activeTabConfig.componentProps || {})}
          {...rest}
        />
      }
    </SplitView>
  );

}

TabView.propTypes = {
  location: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
  onTabMount: PropTypes.func,
  onTabConfig: PropTypes.func,
  onTabUnmount: PropTypes.func,
  tabArrangement: PropTypes.array,
};

export default TabView;
