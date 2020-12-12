import PropTypes from 'prop-types';

import React from 'react';

import ListItemText from '@material-ui/core/ListItemText';
import { valueForKeyPath } from '../util/object';

import VirtualizedListItem, {
  listItemProps,
  commonPropTypes,
} from './VirtualizedListItem';

// -----------------------------------------------------------------------------
function SimpleListItem(props) {
  const { primaryField, secondaryField, ...rest } = props;

  let primary = null;
  if (primaryField) {
    if (typeof(primaryField) === 'function') {
      primary = primaryField(props.item);
    } else {
      primary = valueForKeyPath(props.item, primaryField);
    }
  }

  let secondary = null;
  if (secondaryField) {
    if (typeof(secondaryField) === 'function') {
      secondary = secondaryField(props.item);
    } else {
      secondary = valueForKeyPath(props.item, secondaryField);
    }
  }

  return (
    <VirtualizedListItem {...listItemProps(rest)}>
      <ListItemText primary={primary} secondary={secondary} />
    </VirtualizedListItem>
  );
}
SimpleListItem.propTypes = {
  primaryField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  secondaryField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  ...commonPropTypes,
};


// -----------------------------------------------------------------------------
export default SimpleListItem;
