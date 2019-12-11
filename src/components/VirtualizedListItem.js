/**
*
* VirtualizedListItem
*
*/

import PropTypes from 'prop-types';
import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';

// -----------------------------------------------------------------------------
export const listItemProps = (props) => {
  const { isLink, ...rest } = props;

  const listItemProps = {
    divider: true,
    ...rest,
  };

  if (isLink && props.item.path) {
    listItemProps.button = true;
    listItemProps.component = RouterLink;
    listItemProps.to = props.item.path;
  }

  return listItemProps;
};

export const commonPropTypes = {
  item: PropTypes.object,
  isLink: PropTypes.bool,
};

export const commonDefaultProps = {
  isLink: true,
};


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

  if (selectionMode === 'single') {
    selectionControl = (
      <Radio
        checked={props.selected}
        edge="start"
        onClick={handleSelectionControlClick}
        style={{ padding: 8, marginRight: 8 }}
      />
    );
  }
  if (selectionMode === 'multiple') {
    selectionControl = (
      <Checkbox
        checked={props.selected}
        edge="start"
        onClick={handleSelectionControlClick}
        style={{ padding: 8, marginRight: 8 }}
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
  children: PropTypes.node,
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selected: PropTypes.bool,
  selectOnClick: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
};

export default VirtualizedListItem;
