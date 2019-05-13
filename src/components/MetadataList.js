import moment from 'moment';
import titleCase from 'title-case';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { valueForKeyPath } from '../util/object';

// -----------------------------------------------------------------------------
function _MetadataListItem(props) {
  const { classes, fieldInfo, representedObject } = props;

  function renderValue(value) {
    if (Array.isArray(value)) {
      return value.map((item) => (
        <ListItem key={item.id} classes={{ root: classes.nestedListItemRoot }}>
          {renderValue(item)}
        </ListItem>
      ));
    } else if (fieldInfo.transform) {
      return fieldInfo.transform(value);
    } else if (fieldInfo.dateFormat) {
      return moment(value).format(fieldInfo.dateFormat);
    } else if (fieldInfo.keyPath) {
      return valueForKeyPath(value, fieldInfo.keyPath);
    } else {
      return value;
    }
  }

  let value = representedObject[fieldInfo.name];
  if (value === undefined || value === null || (Array.isArray(value) && !value.length)) {
    if (!fieldInfo.nullValue) {
      // If no value exists for the given field and nothing has been specified
      // to display for null values, returning null skips rendering of the list item.
      return null;
    } else {
      value = fieldInfo.nullValue;
    }
  }

  let LabelContent = fieldInfo.label;
  if (LabelContent === undefined) {
    LabelContent = titleCase(fieldInfo.name);
  }

  let labelComponent = null;
  if (LabelContent) {
    if (typeof(LabelContent) === 'string') {
      labelComponent = <Typography className={classes.label}>{LabelContent}</Typography>;
    } else {
      labelComponent = (
        <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
         <LabelContent className={classes.listItemIcon} />
       </ListItemIcon>
      );
    }
  }

  let PrimaryComponent = Typography;
  const primaryComponentProps = {};
  if (fieldInfo.type === 'link' && value.path) {
    PrimaryComponent = Link;
    primaryComponentProps.component = RouterLink;
    primaryComponentProps.to = value.path;
  } else if (Array.isArray(value)) {
    PrimaryComponent = List;
    primaryComponentProps.disablePadding = true;
  }

  return (
    <ListItem classes={{ root: classes.listItemRoot }}>
      {labelComponent}

      <ListItemText
        classes={{ root: classes.listItemTextRoot }}
        disableTypography
        primary={(
          <PrimaryComponent {...primaryComponentProps}>
            {renderValue(value)}
          </PrimaryComponent>
        )}
      />
    </ListItem>
  );
}

_MetadataListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  fieldInfo: PropTypes.object.isRequired,
  nullValue: PropTypes.string,
  representedObject: PropTypes.object.isRequired,
};

const MetadataListItem = withStyles((theme) => ({
  listItemRoot: {
    display: 'flex',
    padding: '1px 0',
  },

  listItemIconRoot: {
    marginRight: 5,
  },

  listItemIcon: {
    height: 18,
    width: 18,
  },

  listItemTextRoot: {
    padding: 0,
  },

  label: {
    fontWeight: 500,
    marginRight: 5,
    "&:after": {
      content: '":"',
    },
  },

  nestedListItemRoot: {
    display: 'inline',
    fontSize: '0.875rem',
    padding: 0,
    '&:not(:last-child)': {
      marginRight: 5,
      '&:after': {
        content: '","',
      }
    }
  },

  nestedListItemTextRoot: {
    padding: 0,
  },

  nestedListItemContent: {
    display: 'inline',
  }


}))(_MetadataListItem);

// -----------------------------------------------------------------------------
const listItemKey = (fieldInfo) => {
  let key = fieldInfo.name;
  if (fieldInfo.keyPath) {
    key = `${key}-${fieldInfo.keyPath}`;
  }
  return key;
};

function MetadataList(props) {
  return (
    <List disablePadding>
      {props.arrangement.map((fieldInfo) => (
        <MetadataListItem
          key={listItemKey(fieldInfo)}
          fieldInfo={fieldInfo}
          representedObject={props.representedObject}
        />
      ))}
    </List>
  );
}

MetadataList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  representedObject: PropTypes.object.isRequired,
};

export default MetadataList;
