import moment from 'moment';
import titleCase from 'title-case';

import PropTypes from 'prop-types';
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { valueForKeyPath } from '../util/object';

// -----------------------------------------------------------------------------
function _MetadataListItem(props) {
  const { classes, fieldInfo, nullValue, representedObject } = props;

  let value = representedObject[fieldInfo.name];
  if (!value) {
    if (!nullValue) {
      // If no value exists for the given field and nothing has been specified
      // to display for null values, returning null skips rendering of the list item.
      return null;
    } else {
      value = nullValue;
    }
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
    <li key={fieldInfo.name} id={listItemId} className={classes.li}>
      <label htmlFor={listItemId} className={classes.label}>{label}</label>
      {value}
    </li>
  );
}

_MetadataListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  fieldInfo: PropTypes.object.isRequired,
  nullValue: PropTypes.string,
  representedObject: PropTypes.object.isRequired,
};

const MetadataListItem = withStyles({
  li: {
    fontSize: '0.85rem',
    margin: '2px 0',
  },

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
  return (
    <ul>
      {props.arrangement.map((fieldInfo) => (
        <MetadataListItem
          key={fieldInfo.name}
          fieldInfo={fieldInfo}
          nullValue={props.nullValue}
          representedObject={props.representedObject}
        />
      ))}
    </ul>
  );
}

MetadataList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  nullValue: PropTypes.string,
  representedObject: PropTypes.object.isRequired,
};

MetadataList.defaultProps = {
  nullValue: 'None',
};

export default MetadataList;