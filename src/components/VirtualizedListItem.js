/**
*
* VirtualizedListItem
*
*/

import PropTypes from 'prop-types';
import React from 'react';


import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import withStyles from '@material-ui/core/styles/withStyles';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CheckBoxUncheckedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxCheckedIcon from '@material-ui/icons/CheckBox';


function VirtualizedListItem(props) {
  const {
    classes,
    item,
    contextProvider,
    onItemClick,
    onSelectControlClick,
    selectionMode,
    ...rest
  } = props;

  let listItemProps = {};
  if (contextProvider) {
    listItemProps = contextProvider(item);
  }

  if (onItemClick) {
    listItemProps.onClick = () => {
      onItemClick(item);
    }
  }

  let SelectionIcon = null;
  if (selectionMode === 'single') {
    SelectionIcon = props.selected ? RadioButtonCheckedIcon : RadioButtonUncheckedIcon;
  } else if (selectionMode === 'multiple') {
    SelectionIcon = props.selected ? CheckBoxCheckedIcon : CheckBoxUncheckedIcon;
  }

  return (
    <ListItem {...listItemProps} {...rest}>
      {SelectionIcon && (
        <IconButton
          className={classes.selectionControl}
          onClick={(e) => {
            e.preventDefault();
            onSelectControlClick(item);
          }}
        >
          <SelectionIcon />
        </IconButton>
      )}
      {props.children}
    </ListItem>
  );
}

VirtualizedListItem.propTypes = {
  classes: PropTypes.object,
  contextProvider: PropTypes.func,
  onItemClick: PropTypes.func,
  onSelectControlClick: PropTypes.func,
  selected: PropTypes.bool,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
};

export default withStyles({
  selectionControl: {
    padding: 4,
  },
})(VirtualizedListItem);
