/**
*
* TileListItem
*
*/

import classNames from 'classnames';

import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';

const styles = makeStyles((theme) => ({
  box: {
    position: 'relative',
  },

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

function TileListItem(props) {
  const {
    item,
    contextProvider,
    onItemClick,
    onSelectionChange,
    selected,
    selectionMode,
    ...rest
  } = props;

  const listTileProps = contextProvider ? contextProvider(item) : {};

  listTileProps.onClick = (e) => {
    if (selectionMode && onSelectionChange) {
      onSelectionChange(item);
    }

    if (onItemClick) {
      onItemClick(item, e);
    }
  };

  const classes = styles();

  const tileClasses = [];
  if (selected) {
    tileClasses.push(classes.selected);
  }

  return (
    <Box
      className={classes.box}
      {...listTileProps}
      {...rest}
    >
      <span className={classNames(tileClasses)}>
        {props.children}
      </span>

      {selected &&
        <CheckCircleTwoToneIcon className={classes.selectedIcon} />
      }

    </Box>
  );
}

TileListItem.propTypes = {
  contextProvider: PropTypes.func,
  children: PropTypes.any,
  item: PropTypes.object.isRequired,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selected: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
};

export default TileListItem;
