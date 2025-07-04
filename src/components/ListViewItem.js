import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { useEffect, useRef, useMemo } from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import ContextMenuButton from './ContextMenuButton';

import { commonListItemPropTypes } from "./ListView";

const styles = makeStyles((theme) => ({
  selectionEnabled: {
    '& > *': {
      pointerEvents: 'none',
    }
  },

  selectedListItem: {
    backgroundColor: 'rgb(255 228 163 / 25%) !important',
  },

  selected: {
    color: theme.palette.secondary.main,
  },

  deselected: {
    color: theme.palette.action.active,
  },

  selectionActionControl: {
    pointerEvents: 'none',
  },

  topSecondaryAction: {
    right: theme.spacing(0.5),
    top: theme.spacing(1),
    transform: 'initial',
  },
}));

// -----------------------------------------------------------------------------
function ListViewItem(props) {
  const classes = styles();

  const {
    className,
    children,
    commitOnSelect,
    secondaryActionPlacement,
    contextMenuItemArrangement,
    id,
    item,
    onItemClick,
    onMount,
    onUnmount,
    onSelectionChange,
    selected,
    selectionDisabled,
    selectionMode,
    secondaryActionControl,
    ...listItemProps
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


  if (props.to) {
    listItemProps.button = true;
  }

  if (selectionMode && !selectionDisabled) {
    listItemProps.button = true;
    listItemProps.disableRipple = true;
    listItemProps.onMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (onSelectionChange) {
        if (e.key !== 'Enter') {
          // It seems that the "Enter" key also triggers a button's click
          // event, presumably for accessibility reasons.
          // We do NOT want this behavior since the enter key is also commonly used to
          // dismiss modals in which these list items appear.
          // By not disallowing the use of the enter key to affect selection,
          // the selection state of the focused list item gets inadvertently
          // toggled when a modal containing the item is dismissed.
          onSelectionChange(item);
        }
      }
    }
  } else if (onItemClick) {
    listItemProps.button = true;
    listItemProps.onClick = () => {
      onItemClick(item);
    }
  }


  const selectionControl = useMemo(() => {
    if (!selectionMode || selectionDisabled) {
      return null;
    }

    const selectionControlClasses = [classes.selectionActionControl];
    if (secondaryActionPlacement === 'top') {
      selectionControlClasses.push(classes.topSecondaryAction);
    }
    return (
      <ListItemSecondaryAction className={clsx(selectionControlClasses)}>
        {selectionMode === 'multiple' ? (
          selected ? (
            <CheckBoxIcon className={classes.selected} />
          ) : (
            <CheckBoxOutlineBlankIcon className={classes.deselected} />
          )
        ) : (
          selected ? (
            <RadioButtonCheckedIcon className={classes.selected} />
          ) : (
            <RadioButtonUncheckedIcon className={classes.deselected} />
          )
        )}
      </ListItemSecondaryAction>
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


  const classNames = [className];
  if (selectionMode && !selectionDisabled) {
    classNames.push(classes.selectionEnabled);
  }
  if (selected) {
    classNames.push(classes.selectedListItem);
  }

  return (
    <ListItem
      className={clsx(classNames)}
      data-id={id}
      ref={listItemRef}
      {...listItemProps}
    >
      {children}

      {(selectionMode && !selectionDisabled) ? (
        selectionControl
      ) : (
        secondaryListItemAction
      )}
    </ListItem>
  );
}

ListViewItem.propTypes = {
  ...commonListItemPropTypes,
  secondaryActionPlacement: PropTypes.string,
};

export default ListViewItem;
