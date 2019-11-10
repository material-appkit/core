/**
*
* TileListItem
*
*/

import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  box: {
    cursor: 'pointer',
    display: 'table-cell',
  },

  selectionBox: {
    border: `3px solid #F00`,
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
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

  let listTileProps = {};

  if (contextProvider) {
    listTileProps = contextProvider(item);
  }

  listTileProps.onClick = () => {
    if (selectionMode && onSelectionChange) {
      onSelectionChange(item);
    }

    if (onItemClick) {
      onItemClick(item);
    }
  };

  const classes = styles();

  return (
    <Box
      className={classes.box}
      {...listTileProps}
      {...rest}
    >
      {props.children}

      {selected &&
        <Box className={classes.selectionBox}>
        </Box>
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
