import isEqual from 'lodash.isequal';
import qs from 'query-string';
import { matchPath } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from '@material-ui/core/styles/withStyles';

import RemoteStore from '../stores/RemoteStore';

import { indexOfKey } from '../util/map';
import { filterByKeys } from '../util/object';

import SplitView from './SplitView';
import VirtualizedList from './VirtualizedList';

class ListView extends React.PureComponent {
  state = {
    redirectTo: null,
    selectedTabIndex : null,
  };

  constructor(props) {
    super(props);

    this.constructTabConfigList();
  }

  constructTabConfigList() {
    if (this.props.subsetArrangement) {
      const tabConfigList = [];
      const subsetArrangement = this.props.subsetArrangement;

      subsetArrangement.forEach((subset) => {
        let path = this.props.mountPath;

        const subsetName = subset[0];
        if (subsetName) {
          path = `${path}?subset=${subsetName}`;
        }
        subset[1].path = path;

        tabConfigList.push({
          subsetName,
          label: subset[1].tabLabel,
          path,
        });
      });
      this.tabConfigList = tabConfigList;
      this.subsetArrangement = new Map(subsetArrangement);
    } else {
      this.subsetArrangement = null;
      this.tabConfigList = null;
    }
  }

  componentDidMount() {
    if (this.subsetArrangement) {
      let tabIndex = indexOfKey(this.subsetKey, this.subsetArrangement);
      if (tabIndex === -1) {
        // Decide whether we need to redirect.
        // This will be the case when a subset arrangement is in effect and the
        // querystring param does not match any of the existing subset names.
        if (!this.state.redirectTo) {
          const firstSubsetKey = this.subsetArrangement.keys().next().value;
          let subsetConfig = this.subsetArrangement.get(firstSubsetKey);
          this.setState({redirectTo: subsetConfig.path});
        } else {
          this.setState({redirectTo: null});
        }
      } else {
        this.syncItemStore();
        if (tabIndex !== this.state.selectedTabIndex) {
          this.setState({ selectedTabIndex: tabIndex });
          if (this.props.onTabChange) {
            this.props.onTabChange(tabIndex, this.state.selectedTabIndex);
          }
        }
      }
    } else {
      this.syncItemStore();
    }
  }


  get tabs() {
    if (!this.tabConfigList || this.state.selectedTabIndex === null) {
      return null;
    }

    return (
      <Tabs
        className={this.props.classes.tabs}
        indicatorColor="primary"
        scrollButtons="auto"
        textColor="primary"
        value={this.state.selectedTabIndex}
        variant="scrollable"
      >
        {this.tabConfigList.map((tabConfig) => (
          <Tab
            component={Link}
            className={this.props.classes.tab}
            key={tabConfig.subsetName}
            label={tabConfig.label}
            to={tabConfig.path}
          />
        ))}
      </Tabs>
    );
  }

  get qsParams() {
    return qs.parse(this.props.location.search);
  }

  get subsetKey() {
    return this.qsParams.subset || '';
  }

  get activeTabArrangement() {
    if (!this.subsetArrangement) {
      return null;
    }

    return this.subsetArrangement.get(this.subsetKey);
  }

  get filterParams() {
    const { filterParams, qsFilterParamNames } = this.props;

    const params = filterParams || {};
    if (qsFilterParamNames) {
      Object.assign(params, filterByKeys(this.qsParams, qsFilterParamNames));
    }

    const arrangementInfo = this.activeTabArrangement;
    if (arrangementInfo) {
      Object.assign(params, arrangementInfo.apiQueryParams);
    }

    return params;
  }

  syncItemStore = () => {
    const { store } = this.props;

    if (!(store instanceof RemoteStore)) {
      return;
    }

    const filterParams = this.filterParams;
    const storeParams = this.props.store.params;
    if (!filterParams || isEqual(filterParams, storeParams)) {
      return;
    }

    this.props.store.load(filterParams);
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />
    }

    const {
      listItemComponent,
      store,
      isGrouped,
      itemIdKey,
      itemProps,
      items,
      onItemClick,
      onSelectionChange,
      selectionMode,
    } = this.props;

    const list = (
      <VirtualizedList
        componentForItem={listItemComponent}
        store={store}
        isGrouped={isGrouped}
        itemIdKey={itemIdKey}
        itemProps={itemProps}
        items={items}
        onItemClick={onItemClick}
        onSelectionChange={onSelectionChange}
        selectionMode={selectionMode}
      />
    );

    const tabs = this.tabs;

    if (tabs) {
      return (
        <SplitView
          bar={tabs}
          barSize={56}
          placement="top"
        >
          {list}
        </SplitView>
      )
    }

    return list;
  }
}

ListView.propTypes = {
  classes: PropTypes.object,
  createURL: PropTypes.string,
  listItemComponent: PropTypes.func.isRequired,
  store: PropTypes.object,
  entityType: PropTypes.string,
  filterParams: PropTypes.object,
  isGrouped: PropTypes.bool,
  itemIdKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  itemProps: PropTypes.object,
  items: PropTypes.array,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onTabChange: PropTypes.func,
  location: PropTypes.object.isRequired,
  mountPath: PropTypes.string.isRequired,
  qsFilterParamNames: PropTypes.array,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  subsetArrangement: PropTypes.array,
  topbarTitle: PropTypes.string,
};

ListView.defaultProps = {
  itemProps: {},
};

export default withStyles((theme) => ({
  tabs: {
    backgroundColor: '#fafafa',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  tab: {
    minWidth: 100,
  },
}))(ListView);
