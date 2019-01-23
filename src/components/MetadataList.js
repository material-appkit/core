import moment from 'moment';
import titleCase from 'title-case';

import PropTypes from 'prop-types';
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { valueForKeyPath } from '../util/object';

// -----------------------------------------------------------------------------
function _MetadataListItem(props) {
  const { classes, fieldInfo, representedObject } = props;

  let value = representedObject[fieldInfo.name];
  if (!value) {
    // If no such value exists for the given field,
    // returning null effectively skips rendering of the list item.
    return null;
  }

  const listItemId = `${fieldInfo.name}MetadataListItem`;

  let label = fieldInfo.label;
  if (label === undefined) {
    label = titleCase(fieldInfo.name);
  }

  if (fieldInfo.transform) {
    value = fieldInfo.transform(value);
  } else if (fieldInfo.dateFormat) {
    value = moment(value).format(fieldInfo.dateFormat);
  } else if (fieldInfo.keyPath) {
    value = valueForKeyPath(value, fieldInfo.keyPath);
  }

  return (
    <li key={fieldInfo.name} id={listItemId} className={classes.listItem}>
      <label htmlFor={listItemId} className={classes.label}>{label}</label>
      {value}
    </li>
  );
}

_MetadataListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  fieldInfo: PropTypes.object.isRequired,
  representedObject: PropTypes.object.isRequired,
};

const MetadataListItem = withStyles({
  label: {
    display: 'inline-block',
    fontWeight: 500,
    "&:after": {
      content: '":"',
    },
    marginRight: 5,
  },
})(_MetadataListItem);

// -----------------------------------------------------------------------------
function MetadataList(props) {
  const { classes, representedObject } = props;

  return (
    <React.Fragment>
      <ul className={classes.ul}>
        {props.arrangement.map((fieldInfo) => (
          <MetadataListItem
            key={fieldInfo.name}
            fieldInfo={fieldInfo}
            representedObject={representedObject}
          />
        ))}
      </ul>
    </React.Fragment>
  );
}

MetadataList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  representedObject: PropTypes.object.isRequired,
};

export default withStyles({
  ul: {
    fontSize: '0.85rem',
    listStyleType: 'none',
  },
})(MetadataList);