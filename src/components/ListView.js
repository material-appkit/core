import qs from 'query-string';

import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from '@material-ui/core/styles/withStyles';

import VirtualizedList from './VirtualizedList';

import { indexOfKey } from '../util/map';


class ListView extends React.Component {
  constructor(props) {
    super(props);

    this.initializeTabList();

    this.state = {
      selectedTabIndex : null,
    };
  }

  componentDidMount() {
    this.props.store.load(this.filterParams, 0);
  }

  componentDidUpdate() {
    if (this.subsetArrangement) {
      const tabIndex = indexOfKey(this.subsetKey, this.subsetArrangement);
      if (tabIndex !== this.state.selectedTabIndex) {
        this.setState({ selectedTabIndex: tabIndex });
      }
    }

    this.props.store.update(this.filterParams);
  }

  initializeTabList() {
    this.subsetArrangement = null;
    this.tabList = null;

    if (this.props.subsetArrangement) {
      const tabs = [];
      const subsetArrangement = this.props.subsetArrangement;
      subsetArrangement.forEach((subset) => {
        let url = this.props.location.pathname;

        const subsetName = subset[0];
        if (subsetName) {
          url = `${url}?subset=${subsetName}`;
        }
        subset[1].url = url;

        tabs.push(
          <Tab
            component={Link}
            className={this.props.classes.tab}
            key={subsetName}
            label={subset[1].tabLabel}
            to={url}
          />);
      });
      this.tabList = tabs;
      this.subsetArrangement = new Map(subsetArrangement);
    }
  }

  get tabs() {
    if (!this.tabList || this.state.selectedTabIndex === null) {
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
        {this.tabList}
      </Tabs>
    );
  }

  get subsetKey() {
    const qsParams = qs.parse(this.props.location.search);
    return qsParams.subset || '';
  }

  get activeTabArrangement() {
    if (!this.subsetArrangement) {
      return null;
    }

    return this.subsetArrangement.get(this.subsetKey);
  }

  get filterParams() {
    const filterParams = this.props.filterParams ? {...this.props.filterParams} : {};
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
  location: PropTypes.object.isRequired,
  filterParams: PropTypes.object,
  subsetArrangement: PropTypes.array,
  topbarTitle: PropTypes.string,
};

ListView.defaultProps = {
  filterParams: {},
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
