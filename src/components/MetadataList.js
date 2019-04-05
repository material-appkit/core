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
  const { classes, fieldInfo, nullValue, representedObject } = props;

  function renderValue(value) {
    if (Array.isArray(value)) {
      return value.map((item) => (
        <ListItem key={item.id} classes={{ root: classes.listItemRoot }}>
          <ListItemText
            classes={{ root: classes.listItemTextRoot }}
            primary={<Typography>{renderValue(item)}</Typography>}
          />
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
  if (value === undefined || value === null) {
    if (!nullValue) {
      // If no value exists for the given field and nothing has been specified
      // to display for null values, returning null skips rendering of the list item.
      return null;
    } else {
      value = nullValue;
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

  const primaryContent = (
    <PrimaryComponent {...primaryComponentProps}>
      {renderValue(value)}
    </PrimaryComponent>
  );

  return (
    <ListItem classes={{ root: classes.listItemRoot }}>
      {labelComponent}

      <ListItemText
        classes={{ root: classes.listItemTextRoot }}
        primary={primaryContent}
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
    alignItems: 'start',
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
}))(_MetadataListItem);

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
