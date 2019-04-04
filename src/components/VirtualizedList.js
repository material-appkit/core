import { observer } from 'mobx-react';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import withStyles from '@material-ui/core/styles/withStyles';

class VirtualizedList extends React.Component {
  constructor(props) {
    super(props);

    this.loadMoreProgressIndicator = (
      <ListItem className={props.classes.loadProgressListItem} key="loadMoreProgressIndicator">
        <CircularProgress color="primary" size={30} thickness={5} />
      </ListItem>
    );

    this.state = {
      selection: (props.selectionMode) ? {} : null,
    }
  }

  isSelected = (item) => {
    const { selection } = this.state;
    if (selection === null) {
      return false;
    }

    return !!selection[item.id];
  };

  isGrouped = (items) => {
    if (!items || !items.length) {
      return false;
    }
    return Array.isArray(items[0]);
  };

  handleSelectControlClick = (item) => {
    const { onSelectionChange, selectionMode } = this.props;
    const { selection } = this.state;
    const itemId = item.id;

    const newSelection = {};
    if (selectionMode === 'single') {
      if (!selection[itemId]) {
        newSelection[itemId] = item;
      }
    } else {
      Object.assign(newSelection, selection);
      if (newSelection[itemId]) {
        delete newSelection[itemId];
      } else {
        newSelection[itemId] = item;
      }
    }

    this.setState({ selection: newSelection });

    if (onSelectionChange) {
      const selectedItems = Object.values(newSelection);
      if (selectionMode === 'single') {
        onSelectionChange(selectedItems.pop());
      } else {
        onSelectionChange(selectedItems);
      }
    }
  };

  renderItem = (item) => (
    <this.props.componentForItem
      contextProvider={this.props.itemContextProvider}
      key={item.id}
      item={item}
      onItemClick={this.props.onItemClick}
      onSelectControlClick={this.handleSelectControlClick}
      selected={this.isSelected(item)}
      selectionMode={this.props.selectionMode}
      {...this.props.itemProps}
    />
  );

  render() {
    const {
      classes,
      dense,
      items,
      store
    } = this.props;

    let listChildren = null;
    if (items) {
      if (this.isGrouped(items)) {
        listChildren = items.map((itemGroup) => (
          <Fragment key={itemGroup[0]}>
            <ListSubheader className={classes.subheader} disableSticky>
              {itemGroup[0]}
            </ListSubheader>
            {itemGroup[1].map(this.renderItem)}
          </Fragment>
        ));
      } else {
        listChildren = items.map(this.renderItem);
      }
    } else if (store) {
      if (store.items) {
        listChildren = (
          <InfiniteScroll
            getScrollParent={this.props.getScrollParent}
            initialLoad={false}
            pageStart={1}
            loadMore={(page) => { store.loadMore(page); }}
            hasMore={!store.isLoaded}
            loader={this.loadMoreProgressIndicator}
            useWindow={this.props.useWindow}
          >
            {store.items.map(this.renderItem)}
          </InfiniteScroll>
        );
      } else {
        listChildren = this.loadMoreProgressIndicator;
      }
    } else {
      return null;
    }

    return (
      <List className={classes.list} dense={dense}>
        {listChildren}
      </List>
    );
  }
}

VirtualizedList.propTypes = {
  classes: PropTypes.object.isRequired,
  componentForItem: PropTypes.func.isRequired,
  dense: PropTypes.bool,
  getScrollParent: PropTypes.func,
  itemContextProvider: PropTypes.func,
  itemProps: PropTypes.object,
  items: PropTypes.array,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  store: PropTypes.object,
  useWindow: PropTypes.bool,
};

VirtualizedList.defaultProps = {
  dense: false,
  itemProps: {},
  useWindow: true,
};

export default withStyles((theme) => ({
  list: theme.listView.list,
  subheader: theme.listView.subheader,

  loadProgressListItem: {
    justifyContent: 'center',
  },
}))(observer(VirtualizedList));
