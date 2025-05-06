import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import ContextMenuButton from './ContextMenuButton';
import { commonListItemPropTypes } from "./ListView";


const styles = makeStyles((theme) => ({
  gridItem: {
    position: 'relative',
  },

  itemControl: {
    position: 'absolute',
    right: theme.spacing(1.5),
    top: theme.spacing(1.5),
  },

  selectionEnabled: {
    cursor: 'pointer',

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
}));


const GridViewItem = React.forwardRef((props, ref) => {
  const classes = styles();

  const {
    className,
    children,
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
    secondaryActionControl,
    sizes,
    ...gridItemProps
  } = props;


  useEffect(() => {
    if (onMount) {
      onMount(ref.current, item);
    }

    return () => {
      if (onUnmount) {
        onUnmount(ref.current, item);
      }
    }
  }, [item, onMount, onUnmount]);
  
  
  if (selectionMode && !selectionDisabled) {
    gridItemProps.onMouseDown = (e) => {
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
    gridItemProps.button = true;
    gridItemProps.onClick = () => {
      onItemClick(item);
    }
  }



  const selectionControl = useMemo(() => {
    if (!selectionMode || selectionDisabled) {
      return null;
    }

    if (selectionMode === 'multiple') {
      return selected ? (
        <CheckBoxIcon className={classes.selected} />
      ) : (
        <CheckBoxOutlineBlankIcon className={classes.deselected} />
      );
    }

    return selected ? (
      <RadioButtonCheckedIcon className={classes.selected} />
    ) : (
      <RadioButtonUncheckedIcon className={classes.deselected} />
    );
  }, [classes, item, onSelectionChange, selectionMode, selected]);


  const actionControl = useMemo(() => {
    if (!contextMenuItemArrangement) {
      return null;
    }

    return (
      <ContextMenuButton
        buttonProps={{ size: 'small' }}
        representedObject={item}
        menuItemArrangement={contextMenuItemArrangement}
      />
    );
  }, [contextMenuItemArrangement, item]);



  const classNames = [classes.gridItem, className];
  if (selectionMode && !selectionDisabled) {
    classNames.push(classes.selectionEnabled);
  }
  if (selected) {
    classNames.push(classes.selectedListItem);
  }

  return (
    <Grid
      item
      className={clsx(classNames)}
      ref={ref}
      {...sizes}
      {...gridItemProps}
    >
      {children}

      <span className={classes.itemControl}>
        {(selectionMode && !selectionDisabled) ? (
          selectionControl
        ) : (
          actionControl
        )}
      </span>
    </Grid>
  );
});


GridViewItem.propTypes = {
  ...commonListItemPropTypes,
  sizes: PropTypes.object.isRequired,
};

export default React.memo(GridViewItem);

