import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';

import ContextMenuButton from './ContextMenuButton';

import { useInit } from '../util/hooks';


const styles = makeStyles((theme) => ({
  selectionControl: {
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(1),
  },

  secondaryAction: {
    paddingRight: theme.spacing(2),
  },

  listItemSecondaryActionTop: {
    right: 6,
    top: 0,
    transform: `translateY(${theme.spacing(1)}px)`,
  },
}));

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
    selectionControl,
    selectionDisabled,
    selectionMode,
    selectOnClick,
    secondaryActionControl,
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


  const listItemProps = {
    classes: {
      root: className,
      secondaryAction: classes.secondaryAction,
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

  const handleSelectionControlClick = (e) => {
    e.preventDefault();

    if (onSelectionChange) {
      onSelectionChange(item);
    }
  };


  let SelectionComponent = null;
  if (selectionMode && selectionControl && !selectionDisabled) {
    if (selectionMode === 'multiple') {
      SelectionComponent = Checkbox;
    }
    if (selectionMode === 'single') {
      SelectionComponent = Radio;
    }
  }

  let secondaryListItemAction = null;
  if (secondaryActionControl || contextMenuItemArrangement) {
    let secondaryListItemActionContent = null;
    const secondaryListItemClasses = [];
    if (secondaryActionPlacement === 'top') {
      secondaryListItemClasses.push(classes.listItemSecondaryActionTop);
    }

    if (secondaryActionControl) {
      secondaryListItemActionContent = secondaryActionControl;
    } else {
      let menuItemArrangement = contextMenuItemArrangement;
      if (typeof(menuItemArrangement) === 'function') {
        menuItemArrangement = menuItemArrangement(item);
      }
      secondaryListItemActionContent = (
        <ContextMenuButton
          buttonProps={{ size: 'small' }}
          representedObject={item}
          menuItemArrangement={menuItemArrangement}
        />
      );
    }
    secondaryListItemAction = (
      <ListItemSecondaryAction className={clsx(secondaryListItemClasses)}>
        {secondaryListItemActionContent}
      </ListItemSecondaryAction>
    );
  }

  return (
    <ListItem {...listItemProps}>
      {SelectionComponent !== null &&
        <SelectionComponent
          checked={selected}
          className={classes.selectionControl}
          disableRipple
          edge="start"
          onClick={handleSelectionControlClick}
        />
      }
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
  selectionControl: PropTypes.bool,
  selectOnClick: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectionDisabled: PropTypes.bool.isRequired,
  to: PropTypes.string,
};

export default React.memo(ListViewItem);
