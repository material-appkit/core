import PropTypes from 'prop-types';

import React from 'react';

import ListItemText from '@material-ui/core/ListItemText';

import VirtualizedListItem, {
  listItemProps,
  commonPropTypes,
} from './VirtualizedListItem';

// -----------------------------------------------------------------------------
function SimpleListItem(props) {
  const { labelField, ...rest } = props;

  let primary = null;
  if (typeof(labelField) === 'function') {
    primary = labelField(props.item);
  } else {
    primary = props.item[labelField];
  }

  return (
    <VirtualizedListItem {...listItemProps(rest)}>
      <ListItemText primary={primary} />
    </VirtualizedListItem>
  );
}
SimpleListItem.propTypes = {
  labelField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  ...commonPropTypes,
};


// -----------------------------------------------------------------------------
export default SimpleListItem;
