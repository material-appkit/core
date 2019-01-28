/**
*
* VirtualizedListItem
*
*/

import PropTypes from 'prop-types';
import React from 'react';

import ListItem from '@material-ui/core/ListItem';

import withStyles from '@material-ui/core/styles/withStyles';

function VirtualizedListItem(props) {
  const { classes, contextProvider, onItemClick, ...rest } = props;

  const listItemProps = {};
  if (onItemClick) {
    listItemProps.onClick = () => {
      onItemClick(props.item);
    }
  }

  return (
    <ListItem {...listItemProps} {...rest}>
      {props.children}
    </ListItem>
  );
}

VirtualizedListItem.propTypes = {
  classes: PropTypes.object,
  contextProvider: PropTypes.func,
};

export default withStyles({
  radioButton: {
    padding: 8,
  },
})(VirtualizedListItem);
