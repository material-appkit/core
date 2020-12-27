/**
*
* TileViewItem
*
*/

import PropTypes from 'prop-types';
import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';

const styles = makeStyles((theme) => ({
  selected: {
    opacity: 0.6,
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
  const {
    item,
    onItemClick,
    onMount,
    onSelectionChange,
    selected,
    selectionMode,
    ...gridProps
  } = props;

  // const listTileProps = {};
  //
  // listTileProps.onClick = (e) => {
  //   if (selectionMode && onSelectionChange) {
  //     onSelectionChange(item);
  //   }
  //
  //   if (onItemClick) {
  //     onItemClick(item, e);
  //   }
  // };

  const classes = styles();

  const tileClasses = [];
  if (selected) {
    tileClasses.push(classes.selected);
  }

  return (
    <Grid item {...gridProps}>
      {props.children}

      {selected &&
        <CheckCircleTwoToneIcon className={classes.selectedIcon} />
      }
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
};

TileViewItem.propTypes = commonPropTypes;

TileViewItem.defaultProps = {
  component: 'span',
};

export default TileViewItem;

