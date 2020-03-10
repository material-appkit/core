/**
*
* VirtualizedListItem
*
*/

import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import { Link as RouterLink } from 'react-router-dom';

import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Radio from '@material-ui/core/Radio';

import ContextMenuButton from './ContextMenuButton';

import { useInit } from '../util/hooks';

// -----------------------------------------------------------------------------
export const listItemProps = (props) => {
  const {
    onItemUpdate,
    ...rest
} = props;

  return {
    divider: true,
    ...rest,
  };
};

export const commonPropTypes = {
  item: PropTypes.object,
  onItemUpdate: PropTypes.func,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
};

// -----------------------------------------------------------------------------
function VirtualizedListItem(props) {
  const {
    commitOnSelect,
    contextMenuItemArrangement,
    item,
    onItemClick,
    onMount,
    onUnmount,
    onSelectionChange,
    selectionMode,
    selectionDisabled,
    selectOnClick,
    to,
    ...rest
  } = props;

  const listItemRef = useRef(null);

  useInit(() => {
    if (onMount) {
      onMount(listItemRef.current, item);
    }
  }, () => {
    if (onUnmount) {
      onUnmount(listItemRef.current, item);
    }
  });


  const listItemProps = { ref: listItemRef, ...rest };

  if (to) {
    listItemProps.button = true;
    listItemProps.component = RouterLink;
    listItemProps.to = to;
  }

  if (selectOnClick) {
    listItemProps.button = true;
    listItemProps.onClick = (e) => {
      if (onSelectionChange) {
        if (e.key !== 'Enter') {
          // It seems that the "Enter" key also triggers a button's click
          // event, presumably for accessibility reasons. We do NOT want
          // this behavior since the enter key is also commonly used to
          // dismiss modals in which these list items appear.
          // By not disallowing the use of the enter key to affect selection,
          // the selection state of the focused list item gets inadvertently
          // toggled when a modal containing the item is dismissed.
          onSelectionChange(item);
        }
      }
      if (onItemClick) {
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


  let SelectionComponent = null;
  if (!(selectionDisabled || commitOnSelect)) {
    if (selectionMode === 'multiple') {
      SelectionComponent = Checkbox;
    } else if (selectionMode === 'single') {
      SelectionComponent = Radio;
    }
  }

  let secondaryListItemAction = null;
  if (contextMenuItemArrangement) {
    secondaryListItemAction = (
      <ListItemSecondaryAction>
        <ContextMenuButton
          buttonProps={{ edge: 'end' }}
          representedObject={item}
          menuItemArrangement={contextMenuItemArrangement(item)}
        />
      </ListItemSecondaryAction>
    );
  }

  return (
    <ListItem {...listItemProps}>
      {SelectionComponent !== null &&
        <SelectionComponent
          checked={props.selected}
          disableRipple
          edge="start"
          onClick={handleSelectionControlClick}
          style={{ padding: 8, marginRight: 8 }}
        />
      }
      {props.children}

      {secondaryListItemAction}
    </ListItem>
  );
}

VirtualizedListItem.propTypes = {
  children: PropTypes.node,
  contextMenuItemArrangement: PropTypes.func,
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selected: PropTypes.bool,
  selectOnClick: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionDisabled: PropTypes.bool,
  to: PropTypes.string,
};

export default VirtualizedListItem;
