import qs from 'query-string';

import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from '@material-ui/core/styles/withStyles';

import VirtualizedList from './VirtualizedList';

import { indexOfKey } from '../util/map';
import { filterByKeys } from '../util/object';


class ListView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.initializeTabConfigList();

    this.state = {
      redirectUrl: null,
      selectedTabIndex : null,
    };
  }

  componentDidMount() {
    this.props.store.update(this.filterParams);
  }

  componentDidUpdate() {
    if (this.props.location.pathname !== this.props.mountPath) {
      // Since this component may be mounted in the background, only respond
      // to location changes when it is "active"
      return;
    }

    if (this.subsetArrangement) {
      let tabIndex = indexOfKey(this.subsetKey, this.subsetArrangement);
      if (tabIndex === -1) {
        this.setState({ selectedTabIndex: 0 });
      } else {
        if (tabIndex !== this.state.selectedTabIndex) {
          this.setState({ selectedTabIndex: tabIndex });
        }
      }
    }

    this.props.store.update(this.filterParams);
  }

  initializeTabConfigList() {
    this.subsetArrangement = null;
    this.tabConfigList = null;

    if (this.props.subsetArrangement) {
      const tabConfigList = [];
      const subsetArrangement = this.props.subsetArrangement;
      subsetArrangement.forEach((subset) => {
        let url = this.props.location.pathname;

        const subsetName = subset[0];
        if (subsetName) {
          url = `${url}?subset=${subsetName}`;
        }
        subset[1].url = url;

        tabConfigList.push({
          subsetName,
          label: subset[1].tabLabel,
          url,
        });
      });
      this.tabConfigList = tabConfigList;
      this.subsetArrangement = new Map(subsetArrangement);
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
            to={tabConfig.url}
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
    const filterParams = filterByKeys(this.qsParams, this.props.qsFilterParamNames);
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
    return (
      <React.Fragment>
        {this.tabs}
        <VirtualizedList
          componentForItem={this.props.listItemComponent}
          store={this.props.store}
          itemContextProvider={this.props.itemContextProvider}
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
  location: PropTypes.object.isRequired,
  mountPath: PropTypes.string,
  qsFilterParamNames: PropTypes.array,
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
