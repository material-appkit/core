import isEqual from 'lodash.isequal';
import qs from 'query-string';
import { matchPath } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';


import withStyles from '@material-ui/core/styles/withStyles';


import ServiceAgent from '../util/ServiceAgent';
import { filterByKeys } from '../util/object';

import VirtualizedList from './VirtualizedList';

class PagedListView extends React.PureComponent {
  state = {
    filterParams: null,
    items: null,
    redirectTo: null,
  };

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate() {
    this.refresh();
  }

  refresh = () => {
    if (!this.isActive) {
      // Since this component may be mounted in the background, only respond
      // to location changes when it is "active"
      return;
    }

    this.syncItemStore();
  };

  get isActive() {
    const { location, mountPath } = this.props;

    const match = matchPath(location.pathname, { path: mountPath });
    return match.isExact;
  }


  get qsParams() {
    return qs.parse(this.props.location.search);
  }


  get filterParams() {
    const { filterParams, qsFilterParamNames } = this.props;

    const params = filterParams || {};
    if (qsFilterParamNames) {
      Object.assign(params, filterByKeys(this.qsParams, qsFilterParamNames));
    }

    return params;
  }

  syncItemStore = async() => {
    const {
      endpoint,
      filterParams,
      onLoad,
      qsFilterParamNames
    } = this.props;

    const params = filterParams || {};
    if (qsFilterParamNames) {
      Object.assign(params, filterByKeys(this.qsParams, qsFilterParamNames));
    }

    if (!params || isEqual(params, this.state.filterParams)) {
      return;
    }

    this.setState({ filterParams: params });

    const res = await ServiceAgent.get(endpoint, params);
    onLoad(res.body, params);
    this.setState({ items: res.body.results });
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />
    }

    const {
      listItemComponent,
      isGrouped,
      itemContextProvider,
      itemIdKey,
      itemProps,
      onItemClick,
      onSelectionChange,
      selectionMode,
    } = this.props;

    return (
      <VirtualizedList
        componentForItem={listItemComponent}
        isGrouped={isGrouped}
        itemContextProvider={itemContextProvider}
        itemIdKey={itemIdKey}
        itemProps={itemProps}
        items={this.state.items}
        onItemClick={onItemClick}
        onSelectionChange={onSelectionChange}
        selectionMode={selectionMode}
      />
    );
  }
}

PagedListView.propTypes = {
  classes: PropTypes.object,
  createURL: PropTypes.string,
  listItemComponent: PropTypes.func.isRequired,
  endpoint: PropTypes.string,
  entityType: PropTypes.string,
  filterParams: PropTypes.object,
  isGrouped: PropTypes.bool,
  itemContextProvider: PropTypes.func,
  itemIdKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  itemProps: PropTypes.object,
  onItemClick: PropTypes.func,
  onLoad: PropTypes.func,
  onSelectionChange: PropTypes.func,
  location: PropTypes.object.isRequired,
  mountPath: PropTypes.string.isRequired,
  page: PropTypes.number,
  qsFilterParamNames: PropTypes.array,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  topbarTitle: PropTypes.string,
};

PagedListView.defaultProps = {
  itemProps: {},
};

export default withStyles((theme) => ({

}))(PagedListView);
