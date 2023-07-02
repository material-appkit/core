import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { valueForKeyPath } from '../util/object';
import { isValue } from '../util/value';
import { titleCase } from '../util/string';

//----------------------------------------------------------------------------
// Helper function that renders a given value or list of values
function renderValue(value, fieldInfo, obj) {
  if (Array.isArray(value)) {
    return value.map((item, i) => renderValue(item, fieldInfo, obj));
  }

  let renderedValue = value;
  if (fieldInfo.transform) {
    renderedValue = fieldInfo.transform(value, obj);
  }

  const valueType = typeof(renderedValue);
  if (valueType === 'string' || valueType === 'number') {
    renderedValue = (
      <Typography
        variant="inherit"
        noWrap={!fieldInfo.wrap}
      >
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
  const { fieldInfo, label, labelClassName, representedObject } = props;
  const classes = propertyListItemStyles();

  //----------------------------------------------------------------------------
  let value;
  if (fieldInfo.keyPath) {
    value = valueForKeyPath(representedObject, fieldInfo.keyPath);
  } else {
    value = representedObject[fieldInfo.name];
  }

  if ((Array.isArray(value) && !value.length) || value === null) {
    value = fieldInfo.nullValue || null;
  }

  if (!isValue(value)) {
    return null;
  }

  let labelComponent;
  if (fieldInfo.Icon) {
    labelComponent = (
      <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
        <fieldInfo.Icon className={classes.listItemIcon} />
      </ListItemIcon>
    );
  } else {
    labelComponent = (
      <Typography
        className={clsx(classes.label, labelClassName)}
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
        {renderValue(value, fieldInfo, representedObject).map((nestedValue, i) => (
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
    const renderedValue = renderValue(value, fieldInfo, representedObject);
    if (renderedValue) {
      let PrimaryComponent = Fragment;
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
          {renderValue(value, fieldInfo, representedObject)}
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
      disableGutters
      style={listItemStyle}
    >
      {labelComponent}
      {listItemTextPrimary}
    </ListItem>
  );

}

PropertyListItem.propTypes = {
  fieldInfo: PropTypes.object.isRequired,
  fontSize: PropTypes.number,
  Icon: PropTypes.elementType,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  listItemAlignment: PropTypes.string,
  listItemPadding: PropTypes.number,
  minLabelWidth: PropTypes.number,
  maxLabelWidth: PropTypes.number,
  nullValue: PropTypes.string,
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};


const propertyListStyles = makeStyles((theme) => ({
  list: theme.propertyList.root,
}));

function PropertyList(props) {
  const classes = propertyListStyles();

  const {
    arrangement,
    className,
    ...propertyListItemProps
  } = props;

  return (
    <List
      disablePadding
      className={clsx(classes.list, className)}
    >
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
            labelClassName={fieldInfo.labelClassName}
            {...propertyListItemProps}
          />
        );
      })}
    </List>
  );
}

PropertyList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  className: PropTypes.string,
  fontSize: PropTypes.number,
  listItemPadding: PropTypes.number,
  minLabelWidth: PropTypes.number,
  maxLabelWidth: PropTypes.number,
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};

export default React.memo(PropertyList);
