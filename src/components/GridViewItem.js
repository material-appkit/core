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


function GridViewItem(props) {
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

  const gridItemRef = useRef(null);


  
  useEffect(() => {
    if (onMount) {
      onMount(gridItemRef.current, item);
    }

    return () => {
      if (onUnmount) {
        onUnmount(gridItemRef.current, item);
      }
    }
  }, [item, onMount, onUnmount]);
  
  
  if (selectionMode && !selectionDisabled) {
    gridItemProps.button = true;
    gridItemProps.disableRipple = true;
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

      let menuItemArrangement = contextMenuItemArrangement;
      if (typeof(menuItemArrangement) === 'function') {
        menuItemArrangement = menuItemArrangement(item);
      }

      return (
        <ContextMenuButton
          buttonProps={{ size: 'small' }}
          representedObject={item}
          menuItemArrangement={menuItemArrangement}
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
      ref={gridItemRef}
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
}

export const commonPropTypes = {
  children: PropTypes.node,
  secondaryActionControl: PropTypes.element,
  secondaryActionPlacement: PropTypes.string,
  contextMenuItemArrangement: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selected: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionDisabled: PropTypes.bool.isRequired,
  to: PropTypes.string,
};

GridViewItem.propTypes = commonPropTypes;

GridViewItem.defaultProps = {
  component: 'span',
  sizes: { xs: 12, sm: 6, md: 4, lg: 3 },
};

export default React.memo(GridViewItem);

