import moment from 'moment';
import titleCase from 'title-case';

import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { valueForKeyPath } from '../util/object';

// -----------------------------------------------------------------------------
const MetadataListItem = withStyles({
  listItemRoot: {
    padding: '2px 0',
  },

  listItemTextRoot: {
    padding: 0,
  },

  listItemTextPrimary: {
    fontSize: '0.85rem',
  },

  label: {
    fontSize: '0.85rem',
    fontWeight: 500,
    "&:after": {
      content: '":"',
    },
    marginRight: 5,
  },
})((props) => {
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

  let label = fieldInfo.label;
  if (label === undefined) {
    label = titleCase(fieldInfo.name);
  }

  let PrimaryComponent = Typography;
  const primaryComponentProps = {};
  if (fieldInfo.type === 'link' && value.path) {
    PrimaryComponent = Link;
    primaryComponentProps.component = RouterLink;
    primaryComponentProps.to = value.path;
  }


  if (fieldInfo.transform) {
    value = fieldInfo.transform(value);
  } else if (fieldInfo.dateFormat) {
    value = moment(value).format(fieldInfo.dateFormat);
  } else if (fieldInfo.keyPath) {
    value = valueForKeyPath(value, fieldInfo.keyPath);
  }

  const primaryContent = (
    <PrimaryComponent {...primaryComponentProps}>{value}</PrimaryComponent>
  );

  return (
    <ListItem classes={{ root: classes.listItemRoot }}>
      <Typography className={classes.label}>{label}</Typography>
      <ListItemText
        classes={{
          root: classes.listItemTextRoot,
          primary: classes.listItemTextPrimary,
        }}
        primary={primaryContent}
      />
    </ListItem>
  );
});

MetadataListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  fieldInfo: PropTypes.object.isRequired,
  nullValue: PropTypes.string,
  representedObject: PropTypes.object.isRequired,
};

// -----------------------------------------------------------------------------
function MetadataList(props) {
  return (
    <List disablePadding>
      {props.arrangement.map((fieldInfo) => (
        <MetadataListItem
          key={fieldInfo.name}
          fieldInfo={fieldInfo}
          nullValue={props.nullValue}
          representedObject={props.representedObject}
        />
      ))}
    </List>
  );
}

MetadataList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  nullValue: PropTypes.string,
  representedObject: PropTypes.object.isRequired,
};

export default MetadataList;
