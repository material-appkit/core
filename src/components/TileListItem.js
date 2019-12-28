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
  root: {
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
    component,
    contextProvider,
    onItemClick,
    onSelectionChange,
    selected,
    selectionMode,
    ...rest
  } = props;

  const Component = component;
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
    <Component
      className={classes.root}
      {...listTileProps}
      {...rest}
    >
      <span className={classNames(tileClasses)}>
        {props.children}
      </span>

      {selected &&
        <CheckCircleTwoToneIcon className={classes.selectedIcon} />
      }
    </Component>
  );
}

TileListItem.propTypes = {
  component: PropTypes.any,
  contextProvider: PropTypes.func,
  children: PropTypes.any,
  item: PropTypes.object.isRequired,
  onItemClick: PropTypes.func,
  onSelectionChange: PropTypes.func,
  selected: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
};

TileListItem.defaultProps = {
  component: 'span',
};

export default TileListItem;
