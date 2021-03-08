import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';

import ContextMenuButton from './ContextMenuButton';

const styles = makeStyles((theme) => ({
  gridItem: {
    position: 'relative',
  },

  contextMenuButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),

    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 6,

    transition: theme.transitions.create(['background-color'], {
      duration: theme.transitions.duration.short,
    }),

    backgroundColor: theme.palette.grey[50],
    '&:hover': {
      backgroundColor: theme.palette.grey.A100,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.palette.grey[300],
      },
    },
  },

  selectedIcon: {
    border: '2px solid white',
    borderRadius: 15,
    color: theme.palette.primary.main,
    position: 'absolute',

    width: 30,
    height: 30,

    bottom: theme.spacing(1),
    right: theme.spacing(1),
  },
}));


function TileViewItem(props) {
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
    sizes,
    ...rest
  } = props;

  const [contextMenuButton, setContextMenuButton] = useState(null);

  const [gridItemProps] = useState(() => ({
    ...sizes,
    ...rest,
    className: clsx(classes.gridItem, className),
    onClick: (e) => {
      if (selectionMode && onSelectionChange) {
        onSelectionChange(item);
      }

      if (onItemClick) {
        onItemClick(item, e);
      }
    }
  }));


  useEffect(() => {
    if (contextMenuItemArrangement) {
      let menuItemArrangement = contextMenuItemArrangement;
      if (typeof(menuItemArrangement) === 'function') {
        menuItemArrangement = menuItemArrangement(item);
      }
      setContextMenuButton(
        <ContextMenuButton
          buttonProps={{
            className: classes.contextMenuButton,
            size: 'small'
          }}
          representedObject={item}
          menuItemArrangement={menuItemArrangement}
        />
      );
    } else {
      setContextMenuButton(null);
    }
  }, [contextMenuItemArrangement]);

  return (
    <Grid item {...gridItemProps}>
      {props.children}

      {selected &&
        <CheckCircleTwoToneIcon className={classes.selectedIcon} />
      }

      {contextMenuButton}
    </Grid>
  );
}

export const commonPropTypes = {
  children: PropTypes.any,
  item: PropTypes.object,
  onItemUpdate: PropTypes.func,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selected: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  selectOnClick: PropTypes.bool,
  sizes: PropTypes.object,
};

TileViewItem.propTypes = commonPropTypes;

TileViewItem.defaultProps = {
  component: 'span',
  sizes: { xs: 12, sm: 6, md: 4, lg: 3 },
};

export default React.memo(TileViewItem);

