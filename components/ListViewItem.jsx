import PropTypes from 'prop-types';
import React, { useEffect, useRef, useMemo } from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';

import ContextMenuButton from './ContextMenuButton';


const styles = makeStyles((theme) => ({
  selectionControl: {
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(1),
  },

  secondaryActionTop: {
    paddingRight: theme.spacing(2),
  },

  topSecondaryAction: {
    right: theme.spacing(0.75),
    top: theme.spacing(0.75),
    transform: 'initial',
  },
}));

// -----------------------------------------------------------------------------
function ListViewItem(props) {
  const classes = styles();

  const {
    className,
    commitOnSelect,
    secondaryActionPlacement,
    contextMenuItemArrangement,
    item,
    onItemClick,
    onMount,
    onUnmount,
    onSelectionChange,
    selected,
    selectionDisabled,
    selectionMode,
    selectOnClick,
    secondaryActionControl,
    ...rest
  } = props;

  const listItemRef = useRef(null);

  useEffect(() => {
    if (onMount) {
      onMount(listItemRef.current, item);
    }

    return () => {
      if (onUnmount) {
        onUnmount(listItemRef.current, item);
      }
    }
  }, [item, onMount, onUnmount]);


  const listItemProps = {
    classes: {
      root: className,
      secondaryAction: secondaryActionPlacement === 'top' ? classes.secondaryActionTop : null,
    },
    ref: listItemRef,
    ...rest
  };

  if (props.to) {
    listItemProps.button = true;
  }

  if (selectionMode && selectOnClick && !selectionDisabled) {
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
  } else if (onItemClick) {
    listItemProps.button = true;
    listItemProps.onClick = () => {
      onItemClick(item);
    }
  }


  const selectionControl = useMemo(() => {
  let SelectionComponent = null;
    if (selectionMode && !selectionDisabled) {
      if (selectionMode === 'multiple') {
        SelectionComponent = Checkbox;
      }
      if (selectionMode === 'single') {
        SelectionComponent = Radio;
      }
    }

    if (!SelectionComponent) {
      return null;
    }

    return (
      <SelectionComponent
        checked={selected}
        className={classes.selectionControl}
        disableRipple
        edge="start"
        onClick={(e) => {
          e.preventDefault();

          if (onSelectionChange) {
            onSelectionChange(item);
          }
        }}
      />
    );
  }, [classes, item, onSelectionChange, selectionMode, selected]);


  const secondaryListItemAction = useMemo(() => {
    let secondaryActionContent = secondaryActionControl;
    if (!secondaryActionContent && contextMenuItemArrangement) {
      secondaryActionContent = (
        <ContextMenuButton
          buttonProps={{ size: 'small' }}
          representedObject={item}
          menuItemArrangement={contextMenuItemArrangement}
        />
      );
    }

    if (!secondaryActionContent) {
      return null;
    }

    return (
      <ListItemSecondaryAction
        className={secondaryActionPlacement === 'top' ? classes.topSecondaryAction : null}
      >
        {secondaryActionContent}
      </ListItemSecondaryAction>
    );
  }, [
    contextMenuItemArrangement,
    item,
    secondaryActionControl,
    secondaryActionPlacement
  ]);


  return (
    <ListItem {...listItemProps}>
      {selectionControl}
      {props.children}

      {secondaryListItemAction}
    </ListItem>
  );
}

ListViewItem.propTypes = {
  children: PropTypes.node,
  secondaryActionControl: PropTypes.element,
  secondaryActionPlacement: PropTypes.string,
  contextMenuItemArrangement: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selected: PropTypes.bool,
  selectOnClick: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionDisabled: PropTypes.bool.isRequired,
  to: PropTypes.string,
};

export default ListViewItem;


export const commonPropTypes = {
  item: PropTypes.object,
  onItemUpdate: PropTypes.func,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
};
