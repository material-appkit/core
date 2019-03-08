import { observer } from 'mobx-react';

import PropTypes from 'prop-types';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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

  render() {
    const { classes } = this.props;

    return (
      <List className={classes.list} dense={this.props.dense}>
        {(this.props.store && this.props.store.items) ? (
          <InfiniteScroll
            getScrollParent={this.props.getScrollParent}
            initialLoad={false}
            pageStart={1}
            loadMore={(page) => { this.props.store.loadMore(page); }}
            hasMore={!this.props.store.isLoaded}
            loader={this.loadMoreProgressIndicator}
            useWindow={this.props.useWindow}
          >
            {this.props.store.items.map((item) => (
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
            ))}
          </InfiniteScroll>
        ) : (
          <React.Fragment>
            {this.loadMoreProgressIndicator}
          </React.Fragment>
        )}
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
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  store: PropTypes.object.isRequired,
  useWindow: PropTypes.bool,
};

VirtualizedList.defaultProps = {
  dense: false,
  itemProps: {},
  useWindow: true,
};

export default withStyles((theme) => ({
  list: theme.listView.list,

  loadProgressListItem: {
    justifyContent: 'center',
  },
}))(observer(VirtualizedList));
