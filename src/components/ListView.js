import qs from 'query-string';

import PropTypes from 'prop-types';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from '@material-ui/core/styles/withStyles';

import VirtualizedList from './VirtualizedList';

import { indexOfKey } from '../util/map';
import { filterByKeys } from '../util/object';


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


  componentDidUpdate() {
    if (this.props.location.pathname !== this.props.mountPath) {
      // Since this component may be mounted in the background, only respond
      // to location changes when it is "active"
      return;
    }

    if (!this.subsetArrangement) {
      // If we have no subset arrangements, simply set the store update itself with
      // respect to the current URL querystring
      this.props.store.update(this.filterParams);
      return;
    }

    let tabIndex = indexOfKey(this.subsetKey, this.subsetArrangement);
    if (tabIndex === -1) {
      // Decide whether we need to redirect.
      // This will be the case when a subset arrangement is in effect and the
      // querystring param does not match any of the existing subset names.
      if (!this.state.redirectTo) {
        const firstSubsetKey = this.subsetArrangement.keys().next().value;
        let subsetConfig = this.subsetArrangement.get(firstSubsetKey);
        this.setState({ redirectTo: subsetConfig.path });
      } else {
        this.setState({ redirectTo: null });
      }
    } else {
      if (tabIndex !== this.state.selectedTabIndex) {
        this.setState({ selectedTabIndex: tabIndex });
      }
      this.props.store.update(this.filterParams);
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
    const filterParams = this.props.filterParams || {};
    Object.assign(filterParams, filterByKeys(this.qsParams, this.props.qsFilterParamNames));

    const arrangementInfo = this.activeTabArrangement;
    if (arrangementInfo) {
      Object.assign(filterParams, arrangementInfo.apiQueryParams);
    }

    return filterParams;
  }

  reloadItemStore = async() => {
    const filterParams = this.filterParams;
    if (filterParams) {
      return;
    }
    this.props.store.update(filterParams);
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />
    }

    return (
      <React.Fragment>
        {this.tabs}
        <VirtualizedList
          componentForItem={this.props.listItemComponent}
          store={this.props.store}
          itemContextProvider={this.props.itemContextProvider}
          onItemClick={this.props.onItemClick}
          onSelectionChange={this.props.onSelectionChange}
          selectionMode={this.props.selectionMode}
        />
      </React.Fragment>
    );
  }
}

ListView.propTypes = {
  classes: PropTypes.object,
  createURL: PropTypes.string,
  listItemComponent: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  entityType: PropTypes.string,
  filterParams: PropTypes.object,
  itemContextProvider: PropTypes.func,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  location: PropTypes.object.isRequired,
  mountPath: PropTypes.string.isRequired,
  qsFilterParamNames: PropTypes.array,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  subsetArrangement: PropTypes.array,
  topbarTitle: PropTypes.string,
};

ListView.defaultProps = {
  qsFilterParamNames: [],
};

export default withStyles((theme) => ({
  tabs: {
    backgroundColor: '#fafafa',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  tab: {
    padding: '0 10px',
  },
}))(ListView);
