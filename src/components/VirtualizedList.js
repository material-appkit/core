import { observer } from 'mobx-react';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

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

  keyForItem = (item) => {
    const { itemIdKey } = this.props;
    return (typeof itemIdKey === 'function') ? itemIdKey(item) : item[itemIdKey];

  };

  isSelected = (item) => {
    const { selection } = this.state;
    if (selection === null) {
      return false;
    }

    const itemId = this.keyForItem(item);
    return !!selection[itemId];
  };

  handleSelectionChange = (item) => {
    const { onSelectionChange, selectionMode } = this.props;
    const { selection } = this.state;
    const itemId = this.keyForItem(item);

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

  renderItem = (item, groupKey) => {
    let itemKey = this.keyForItem(item);
    if (groupKey !== undefined) {
      itemKey = `${groupKey}:${itemKey}`;
    }

    return (
      <this.props.componentForItem
        contextProvider={this.props.itemContextProvider}
        key={itemKey}
        item={item}
        onSelectionChange={this.handleSelectionChange}
        selected={this.isSelected(item)}
        selectionMode={this.props.selectionMode}
        selectOnClick={this.props.selectOnClick}
        {...this.props.itemProps}
      />
    );
  };

  render() {
    const {
      classes,
      dense,
      isGrouped,
      items,
    } = this.props;

    let listChildren = null;
    if (items) {
      if (isGrouped) {
        listChildren = items.map((itemGroup) => {
          const groupName = itemGroup[0];
          const groupedItems = itemGroup[1];

          return (
          <Fragment key={groupName}>
            <ListSubheader className={classes.subheader} disableSticky>
              {groupName}
            </ListSubheader>
            {groupedItems.map((item) => this.renderItem(item, groupName))}
          </Fragment>
          )
        });
      } else {
        listChildren = items.map(this.renderItem);
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
  isGrouped: PropTypes.bool,
  itemContextProvider: PropTypes.func,
  itemIdKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  itemProps: PropTypes.object,
  items: PropTypes.array,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selectOnClick: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  useWindow: PropTypes.bool,
};

VirtualizedList.defaultProps = {
  dense: false,
  isGrouped: false,
  itemIdKey: 'id',
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
