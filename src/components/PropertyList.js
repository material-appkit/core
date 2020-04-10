import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { valueForKeyPath } from '../util/object';
import { titleCase } from '../util/string';

//----------------------------------------------------------------------------
// Helper function that renders a given value or list of values
function renderValue(value, fieldInfo) {
  if (Array.isArray(value)) {
    return value.map((item, i) => renderValue(item, fieldInfo));
  }

  let renderedValue = value;
  if (fieldInfo.transform) {
    renderedValue = fieldInfo.transform(value);
  }

  const valueType = typeof(renderedValue);
  if (valueType === 'string' || valueType === 'number') {
    renderedValue = (
      <Typography variant="body2">
        {renderedValue}
      </Typography>
    );
  }

  return renderedValue;
}

// -----------------------------------------------------------------------------
const propertyListItemStyles = makeStyles(
  (theme) => theme.propertyList.listItem
);

function PropertyListItem(props) {
  const { fieldInfo, representedObject } = props;
  const classes = propertyListItemStyles();

  //----------------------------------------------------------------------------
  let value = null;
  if (fieldInfo.keyPath) {
    value = valueForKeyPath(representedObject, fieldInfo.keyPath);
  } else {
    value = representedObject[fieldInfo.name];
  }

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
      console.log(props);
      labelComponent = (
        <Typography
          className={classes.label}
          style={{ minWidth: props.minLabelWidth }}
        >
          {LabelContent}
        </Typography>
      );
    } else {
      labelComponent = (
        <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
          <LabelContent className={classes.listItemIcon} />
        </ListItemIcon>
      );
    }
  }

  let PrimaryComponent = Box;
  const primaryComponentProps = {};
  if (fieldInfo.type === 'link' && value.path && props.LinkComponent) {
    PrimaryComponent = Link;
    primaryComponentProps.component = props.LinkComponent;
    primaryComponentProps.to = value.path;
  }

  if (fieldInfo.type === 'href') {
    PrimaryComponent = Link;
    primaryComponentProps.href = value;
  }

  return (
    <ListItem classes={{ root: classes.listItemRoot }}>
      {labelComponent}

      <ListItemText
        classes={{ root: classes.listItemTextRoot }}
        disableTypography
        primary={Array.isArray(value) ? (
          <List
            disablePadding
            className={fieldInfo.inline ? classes.inlineNestedList : classes.nestedList}
          >
            {renderValue(value, fieldInfo).map((nestedValue, i) => (
              <ListItem
                className={classes.nestedListItem}
                disableGutters
                key={i}
              >
                {nestedValue}
              </ListItem>
            ))}
          </List>
        ) : (
          <PrimaryComponent {...primaryComponentProps}>
            {renderValue(value, fieldInfo)}
          </PrimaryComponent>
        )}
      />
    </ListItem>
  );
}

PropertyListItem.propTypes = {
  fieldInfo: PropTypes.object.isRequired,
  minLabelWidth: PropTypes.number,
  nullValue: PropTypes.string,
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};

// -----------------------------------------------------------------------------
const metadataStyles = makeStyles(
  (theme) => theme.propertyList
);

function PropertyList(props) {
  const classes = metadataStyles();

  return (
    <List className={classes.root}>
      {props.arrangement.map((fieldInfo) => {
        let key = fieldInfo.name;
        if (fieldInfo.keyPath) {
          key = `${key}-${fieldInfo.keyPath}`;
        }

        return (
          <PropertyListItem
            key={key}
            fieldInfo={fieldInfo}
            minLabelWidth={props.minLabelWidth}
            LinkComponent={props.LinkComponent}
            representedObject={props.representedObject}
          />
        );
      })}
    </List>
  );
}

PropertyList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  minLabelWidth: PropTypes.number,
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};

export default PropertyList;
