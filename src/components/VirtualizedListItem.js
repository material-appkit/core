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
    onItemClick,
    onSelectionChange,
    selectionMode,
    selectOnClick,
    ...rest
  } = props;

  let listItemProps = {};

  if (selectOnClick) {
    listItemProps.button = true;
    listItemProps.onClick = (e) => {
      if (onSelectionChange) {
        e.preventDefault();
        onSelectionChange(item);
      } else if (onItemClick) {
        onItemClick(item);
      }
    }
  }


  const handleSelectionControlClick = (e) => {
    e.preventDefault();

    if (onSelectionChange) {
      onSelectionChange(item);
    }
  };

  let selectionControl = null;

  if (!selectOnClick) {
    if (selectionMode === 'single') {
      selectionControl = (
        <Radio
          checked={props.selected}
          style={{ padding: 8, marginRight: 8 }}
          onClick={handleSelectionControlClick}
        />
      );
    }
    if (selectionMode === 'multiple') {
      selectionControl = (
        <Checkbox
          checked={props.selected}
          style={{ padding: 8, marginRight: 8 }}
          onClick={handleSelectionControlClick}
        />
      );
    }
  }

  return (
    <ListItem {...listItemProps} {...rest}>
      {selectionControl}
      {props.children}
    </ListItem>
  );
}

VirtualizedListItem.propTypes = {
  children: PropTypes.node,
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selected: PropTypes.bool,
  selectOnClick: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
};

export default VirtualizedListItem;
