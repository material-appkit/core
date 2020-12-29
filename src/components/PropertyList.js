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
import { isValue } from '../util/value';
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
      <Typography variant="inherit">
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
  const { fieldInfo, label, representedObject } = props;
  const classes = propertyListItemStyles();

  //----------------------------------------------------------------------------
  let value = null;
  if (fieldInfo.keyPath) {
    value = valueForKeyPath(representedObject, fieldInfo.keyPath);
  } else {
    value = representedObject[fieldInfo.name];
  }

  if ((Array.isArray(value) && !value.length) || !isValue(value)) {
    value = fieldInfo.nullValue || null;
  }

  if (!isValue(value)) {
    return null;
  }

  let labelComponent = null;
  if (fieldInfo.Icon) {
    labelComponent = (
      <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
        <fieldInfo.Icon className={classes.listItemIcon} />
      </ListItemIcon>
    );
  } else {
    labelComponent = (
      <Typography
        className={classes.label}
        style={{
          minWidth: props.minLabelWidth,
          maxWidth: props.maxLabelWidth,
        }}
        variant="inherit"
      >
        {label}
      </Typography>
    );
  }


  let listItemTextPrimary = null;
  if (Array.isArray(value)) {
    listItemTextPrimary = (
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
    )
  } else {
    const renderedValue = renderValue(value, fieldInfo);
    if (renderedValue) {
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

      listItemTextPrimary = (
        <PrimaryComponent {...primaryComponentProps}>
          {renderValue(value, fieldInfo)}
        </PrimaryComponent>
      );
    }
  }

  if (!listItemTextPrimary) {
    return null;
  }

  const listItemStyle = {};
  if (isValue(props.listItemPadding)) {
    listItemStyle.padding = `${props.listItemPadding}px 0`;
  }
  if (props.fontSize) {
    listItemStyle.fontSize = `${props.fontSize}px`;
  }
  if (props.listItemAlignment) {
    listItemStyle.alignItems = props.listItemAlignment;
  }

  return (
    <ListItem
      classes={{ root: classes.listItemRoot }}
      style={listItemStyle}
    >
      {labelComponent}

      <ListItemText
        classes={{ root: classes.listItemTextRoot }}
        disableTypography
        primary={listItemTextPrimary}
      />
    </ListItem>
  );

}

PropertyListItem.propTypes = {
  fieldInfo: PropTypes.object.isRequired,
  fontSize: PropTypes.number,
  Icon: PropTypes.elementType,
  label: PropTypes.string,
  listItemAlignment: PropTypes.string,
  listItemPadding: PropTypes.number,
  minLabelWidth: PropTypes.number,
  maxLabelWidth: PropTypes.number,
  nullValue: PropTypes.string,
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};

// -----------------------------------------------------------------------------
const metadataStyles = makeStyles(
  (theme) => theme.propertyList
);


/**
 * @public
 */
function PropertyList(props) {
  const classes = metadataStyles();

  const { arrangement, ...propertyListItemProps } = props;

  return (
    <List className={classes.root}>
      {arrangement.map((arrangementItem) => {
        let fieldInfo = arrangementItem;
        if (typeof(fieldInfo) === 'string') {
          fieldInfo = { name: fieldInfo };
        }

        let fieldLabel = fieldInfo.label;
        if (fieldLabel === undefined) {
          fieldLabel = titleCase(fieldInfo.name);
        }

        return (
          <PropertyListItem
            fieldInfo={fieldInfo}
            key={`${fieldLabel}-${fieldInfo.keyPath || fieldInfo.name}`}
            label={fieldLabel}
            {...propertyListItemProps}
          />
        );
      })}
    </List>
  );
}

PropertyList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  fontSize: PropTypes.number,
  listItemPadding: PropTypes.number,
  minLabelWidth: PropTypes.number,
  maxLabelWidth: PropTypes.number,
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};

export default React.memo(PropertyList);
