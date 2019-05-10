/**
*
* VirtualizedListItem
*
*/

import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';

function VirtualizedListItem(props) {
  const {
    item,
    contextProvider,
    onItemClick,
    selectionMode,
    ...rest
  } = props;

  let listItemProps = {};
  if (contextProvider) {
    listItemProps = contextProvider(item);
  }

  if (onItemClick) {
    listItemProps.onClick = () => {
      onItemClick(item);
    }
  }

  let selectionControl = null;
  if (selectionMode === 'single') {
    selectionControl = (
      <Radio
        checked={props.selected}
        style={{ padding: 8 }}
      />
    );
  }
  if (selectionMode === 'multiple') {
    selectionControl = (
      <Checkbox
        checked={props.selected}
        style={{ padding: 8 }}
      />
    );
  }

  return (
    <ListItem {...listItemProps} {...rest}>
      {selectionControl}
      {props.children}
    </ListItem>
  );
}

VirtualizedListItem.propTypes = {
  contextProvider: PropTypes.func,
  onItemClick: PropTypes.func,
  selected: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
};

export default VirtualizedListItem;
